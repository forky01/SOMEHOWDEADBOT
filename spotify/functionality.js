import {getDevices} from './getInfo.js';
import {startPlayback} from './modifyPlayback.js';

export async function play(token, channel) {
  var deviceId = await chooseDevice(token, channel);
  if (deviceId != null){
    var isPlaying = await startPlayback(token, deviceId);
    if (isPlaying) {
      channel.send("eNjOy");
    }
  }
}

async function chooseDevice(token, channel) {
  var devicesResponse = await getDevices(token);
  if (devicesResponse != null) {
    var devices = devicesResponse.data.devices;
    if(devices.length == 0) {
      channel.send("Open spotify");
      return null;
    }
    else if (devices.length == 1) {
      if(devices[0].is_restricted) {
        channel.send("Use a different device");
        return null;
      }
      else{
        return devices[0].id;
      }
    }
    else{
      //choose the active device -> then laptop -> then phone -> then random
      var selected = [];
      var restrictedCount = 0;
      for (var i = 0; i < devices.length; i++) {
        if (devices[i].is_restricted) {
          restrictedCount ++;
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
      }
      if (restrictedCount != devices.length) {
        for (var i = 0; i < selected.length; i++) {
          if (selected[i]) {
            return selected[i];
          }
        }
        return devices[0];
      }
      else {
        channel.send("Use a different device");
        return null;
      }
    }
  }
}