import { getDevices } from "./getInfo.js";
import { resumePlayback, startTrackPlayback, startPlaylistPlayback, toggleShuffle } from "./modifyPlayback.js";
import { getUser, getUserValue, setUser } from "../userInfo.js";
import { addVoiceChannel, addListener, getCurrentListeners } from '../currentListeners.js';

export async function play(username, textChannel, msg, member, audioType, audioId) {
  // check initiator has auth before proceeding
  var initiatorTokenAuth = getUserTokenAuth(username);
  if (initiatorTokenAuth != null) {
    var listeners = await getListeners(username, member, textChannel, initiatorTokenAuth);
    if (listeners != null) {
      listeners.forEach(async(v) => {
        if (audioType == "playlist") {
          var playlistUri = `spotify:playlist:${audioId}`;
          await toggleShuffle(v[0], v[1], true);
          await startPlaylistPlayback(v[0], v[1], playlistUri);
        }
        else if (audioType == "track") {
          var trackUri = `spotify:track:${audioId}`;
          await startTrackPlayback(v[0], v[1], trackUri);
        }
      });
    }
  }
  else {
    msg.react("👎");
  }
}

export async function getListeners(initiatorUsername, member, textChannel, initiatorTokenAuth) {
  if (checkInitiator(member.voice, textChannel)) {
    var voiceChannelId = member.voice.channelId;
    var deviceId = await getDeviceId(initiatorUsername, initiatorTokenAuth, textChannel);
    //make sure initiator has a device to play music
    if (deviceId != null) {
      addVoiceChannel(voiceChannelId, initiatorUsername, [initiatorTokenAuth, deviceId]);
      var voiceChannel = member.voice.channel;
      voiceChannel.members.forEach(async(v) => {
        if (checkVoiceChannelMembers(v, initiatorUsername)) {
          var memberUsername = v.user.username;
          var tokenAuth = getUserTokenAuth(memberUsername);
          var deviceId = await getDeviceId(initiatorUsername, tokenAuth, textChannel);
          addListener(voiceChannelId, memberUsername, [tokenAuth, deviceId]);
        }
      });
      return getCurrentListeners(voiceChannelId);
    }
  }
  return null;
}

export function checkVoiceChannelMembers(v, initiatorName) {
  if (!v.user.username == initiatorName) {
    //later check for autojoin
    var isDeaf = v.voice.deaf;
    var isMute = v.voice.mute;
    // check user isn't deaf/mute (otherwise probs MIA)
    if(!isDeaf && !isMute) {
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
    if(voiceChannelSize > 1) {
      var isDeaf = initiatorVoiceState.deaf;
      var isMute = initiatorVoiceState.mute;
      // Initiator shouldn't be deafened or muted
      if(!isDeaf && !isMute) {
        return true;
      }
      else{
        textChannel.send("You're deafened/muted");
        return false;
      }
    }
    else{
      textChannel.send("No one else is here...");
      return false;
    }
  }
  textChannel.send("Please join VC");
  return false;
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
