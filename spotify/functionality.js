import { getDevices } from "./getInfo.js";
import { resumePlayback, startTrackPlayback, startPlaylistPlayback, toggleShuffle } from "./modifyPlayback.js";
import { getUser } from "../userInfo.js";

export async function play(username, channel, audioType, audioId) {
  var tokenAuth = getUserToken(username);

  var deviceId = await chooseDevice(tokenAuth, channel);
  if (deviceId != null) {
    var isPlaying;

    if (audioType == "playlist") {
      var playlistUri = `spotify:playlist:${audioId}`;
      await toggleShuffle(tokenAuth, deviceId, true);
      isPlaying = await startPlaylistPlayback(tokenAuth, deviceId, playlistUri);
    }
    else if (audioType == "track") {
      var trackUri = `spotify:track:${audioId}`;
      isPlaying = await startTrackPlayback(tokenAuth, deviceId, trackUri);
    }

    if (isPlaying) {
      channel.send("eNjOy");
    }
  }
}

export async function resume(username, channel) {
  var tokenAuth = getUserToken(username);

  var deviceId = await chooseDevice(tokenAuth, channel);
  if (deviceId != null) {
    var isPlaying = await resumePlayback(tokenAuth, deviceId);
    if (isPlaying) {
      channel.send("eNjOy");
    }
  }
}

function getUserToken(username) {
  var user = getUser(username);
  var accessToken = user.get("accessToken");
  var tokenType = user.get("tokenType");
  return `${tokenType} ${accessToken}`;
}

async function chooseDevice(tokenAuth, channel) {
  var devicesResponse = await getDevices(tokenAuth);
  if (devicesResponse != null) {
    var devices = devicesResponse.data.devices;
    if (devices.length == 0) {
      channel.send("Open spotify");
      return null;
    }
    else if (devices.length == 1) {
      if (devices[0].is_restricted) {
        channel.send("Use a different device");
        return null;
      }
      else {
        return devices[0].id;
      }
    }
    else {
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
      //makes sure all devices aren"t restricted before return
      if (restrictedCount == devices.length) {
        channel.send("Use a different device");
        return null;
      }
      //otherwise attempt to return the prefered devices
      else {
        if (selected.length > 0) {
          // returns device in preference order
          // i.e. if there"s an computer ID return it otherwise return phone ID
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
  }
}