import { getDevices, getPlaylistSongs, getPlaylistSongsNextUrl } from "./getInfo.js";
import { resumePlayback, startTrackPlayback, toggleShuffle } from "./modifyPlayback.js";
import { getUser, getUserValue, setUser } from "../userInfo.js";
import { addVoiceChannel, addListener, getCurrentListeners } from "../currentListeners.js";
import arrayShuffle from "array-shuffle";

export async function play(username, textChannel, msg, member, audioType, audioId) {
  // check initiator has auth before proceeding
  var initiatorTokenAuth = getUserTokenAuth(username);
  if (initiatorTokenAuth != null) {
    var listeners = await getListeners(username, member, textChannel, initiatorTokenAuth);
    if (listeners != null) {
      var guildName = msg.guild.name;
      var voiceChannelName = member.voice.channel.name;
      console.log(`${listeners.size} listener(s) on '${voiceChannelName}' VC '${guildName}' guild`);
      //if there are listeners and the supplied url is a playlist then shuffle songs
      var trackUri;
      if (audioType == "playlist") {
        //default is shuffling the songs in the playlist
        var shuffledSongs = await shufflePlaylistSongs(initiatorTokenAuth, audioId);
        if (shuffledSongs != null) {
          trackUri = getPlaylistSongUris(shuffledSongs);
        }
      }
      else if (audioType == "track") {
        trackUri = `spotify:track:${audioId}`;
      }
      if (trackUri != null) {
        for (var v of listeners.values()) {
          var tokenAuth = v[0];
          var deviceId = v[1];
          //toggleShuffle and startTrackPlayback are not awaited to ensure playback is as in sync as possible
          toggleShuffle(tokenAuth, deviceId, false);
          startTrackPlayback(tokenAuth, deviceId, trackUri);
        }
        msg.react("👌");
      }
    }
  }
  else {
    msg.react("👎");
  }
}

async function getListeners(initiatorUsername, member, textChannel, initiatorTokenAuth) {
  if (checkInitiator(member.voice, textChannel)) {
    var voiceChannelId = member.voice.channelId;
    var deviceId = await getDeviceId(initiatorUsername, initiatorTokenAuth, textChannel);
    // make sure initiator has a device to play music
    if (deviceId != null) {
      addVoiceChannel(voiceChannelId, initiatorUsername, [initiatorTokenAuth, deviceId]);
      var voiceChannel = member.voice.channel;
      for (var v of voiceChannel.members.values()) {
        if (checkVoiceChannelMembers(v, initiatorUsername)) {
          var memberUsername = v.user.username;
          var tokenAuth = getUserTokenAuth(memberUsername);
          if(tokenAuth != null) {
            deviceId = await getDeviceId(memberUsername, tokenAuth, textChannel);
            addListener(voiceChannelId, memberUsername, [tokenAuth, deviceId]);
          }
        }
      }

      return getCurrentListeners(voiceChannelId);
    }
  }
  return null;
}

function checkVoiceChannelMembers(v, initiatorName) {
  if (v.user.username != initiatorName) {
    //later check for autojoin
    var isDeaf = v.voice.deaf;
    var isMute = v.voice.mute;
    // check user isn't deaf/mute (otherwise probs MIA)
    if (!isDeaf && !isMute) {
      return true;
    }
  }
}

function checkInitiator(initiatorVoiceState, textChannel) {
  var isInVoiceChannel = initiatorVoiceState.channel;
  //must be in a voice channel to trigger group listening
  if (isInVoiceChannel) {
    var voiceChannelSize = initiatorVoiceState.channel.members.size;
    // make sure there's more than 1 person in the call for group listening
    if (voiceChannelSize > 1) {
      var isDeaf = initiatorVoiceState.deaf;
      var isMute = initiatorVoiceState.mute;
      // Initiator shouldn't be deafened or muted
      if (!isDeaf && !isMute) {
        return true;
      }
      else {
        textChannel.send("You're deafened/muted");
        return false;
      }
    }
    else {
      textChannel.send("No one else is here...");
      return false;
    }
  }
  textChannel.send("Please join VC");
  return false;
}

async function shufflePlaylistSongs(tokenAuth, playlistId) {
  var songs = [];

  var response = await getPlaylistSongs(tokenAuth, playlistId);
  if (response != null) {
    songs.push(response.data.items);
    var nextUrl = response.data.next;

    while (nextUrl != null) {
      response = await getPlaylistSongsNextUrl(tokenAuth, nextUrl);
      if (response != null) {
        songs.push(response.data.items);
        nextUrl = response.data.next;
      }
      else {
        return null;
      }
    }

    songs = songs.flat();

    var shuffledSongs = arrayShuffle(songs);

    return shuffledSongs;
  }
  return null;
}

function getPlaylistSongUris(shuffledSongs) {
  var songUris = [];
  shuffledSongs.forEach((item) => {
    songUris.push(item.track.uri);
  });
  return songUris;
}

export async function resume(username, textChannel) {
  var tokenAuth = getUserTokenAuth(username);
  if (tokenAuth != null) {
    var deviceId = await getDeviceId(username, tokenAuth, textChannel);
    if (deviceId != null) {
      setUser(username, "deviceId", deviceId); //store the chosen device
      var isPlaying = await resumePlayback(tokenAuth, deviceId);
      if (isPlaying) {
        textChannel.send("eNjOy");
      }
    }
  }
}

function getUserTokenAuth(username) {
  var user = getUser(username);
  if (user != null) {
    var accessToken = user.get("accessToken");
    var tokenType = user.get("tokenType");
    return `${tokenType} ${accessToken}`;
  }
  return null;
}

async function getDeviceId(username, tokenAuth, textChannel) {
  var storedDeviceId = getUserValue(username, "deviceId");
  if (!storedDeviceId) {
    var devicesResponse = await getDevices(tokenAuth);
    if (devicesResponse != null) {
      var devices = devicesResponse.data.devices;
      if (devices.length == 0) {
        textChannel.send("Open spotify");
        return null;
      }
      else if (devices.length == 1) {
        if (devices[0].is_restricted) {
          textChannel.send("Use a different device");
          return null;
        }
        else {
          return devices[0].id;
        }
      }
      else {
        return chooseDevice(devices, textChannel);
      }
    }
    return null;
  }
  else {
    return storedDeviceId;
  }
}


function chooseDevice(devices, textChannel) {
  // Attempts to select most logical device for playback -> the active device -> then laptop -> then phone -> then a randomly selected default
  var selected = [];
  var restrictedCount = 0;
  var defaultID;
  for (var i = 0; i < devices.length; i++) {
    // if device is restricted skip and check other devices
    if (devices[i].is_restricted) {
      restrictedCount++;
    }
    else if (devices[i].is_active) {
      return devices[i].id;
    }
    else if (devices[i].type == "Computer") {
      selected[0] = devices[i].id;
    }
    else if (devices[i].type == "Smartphone") {
      selected[1] = devices[i].id;
    }
    else if (!defaultID) {
      // the first non restricted device becomes the defaultID
      defaultID = devices[i].id;
    }
  }
  //makes sure all devices aren't restricted before return
  if (restrictedCount == devices.length) {
    textChannel.send("Use a different device");
    return null;
  }
  //otherwise attempt to return the prefered devices
  else {
    if (selected.length > 0) {
      // returns device in preference order
      // i.e. if there's an computer ID return it otherwise return phone ID
      for (var i = 0; i < selected.length; i++) {
        if (selected[i]) {
          return selected[i];
        }
      }
    }
    //otherwise return the default
    return defaultID;
  }
}
