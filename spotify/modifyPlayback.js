import axios from "axios";
import { errorHandling } from "../errorHandling.js";

export async function resumePlayback(tokenAuth, deviceId) {
  var options = {
    url: "https://api.spotify.com/v1/me/player/play",
    method: "put",
    params: {
      device_id: deviceId
    },
    headers: {
      "Authorization": tokenAuth,
      "Accept": "application/json",
      "Content-Type": " application/json"
    }
  };
  let response = await axios(options).catch((error) => errorHandling(error, "resume"));
  if (response != null) {
    return true;
  }
  return null;
}

export async function startTrackPlayback(tokenAuth, deviceId, trackUri) {
  var options = {
    url: "https://api.spotify.com/v1/me/player/play",
    method: "put",
    params: {
      device_id: deviceId
    },
    data: {
      uris: [trackUri].flat()
    },
    headers: {
      "Authorization": tokenAuth,
      "Accept": "application/json",
      "Content-Type": " application/json"
    }
  };
  let response = await axios(options).catch((error) => errorHandling(error, "playSong"));
  if (response != null) {
    return true;
  }
  return null;
}

export async function startPlaylistPlayback(tokenAuth, deviceId, playlistUri) {
  var options = {
    url: "https://api.spotify.com/v1/me/player/play",
    method: "put",
    params: {
      device_id: deviceId
    },
    data: {
      context_uri: playlistUri
    },
    headers: {
      "Authorization": tokenAuth,
      "Accept": "application/json",
      "Content-Type": " application/json"
    }
  };
  let response = await axios(options).catch((error) => errorHandling(error, "playPlaylist"));
  if (response != null) {
    return true;
  }
  return null;
}

export async function toggleShuffle(tokenAuth, deviceId, shuffle) {
  var options = {
    url: "https://api.spotify.com/v1/me/player/shuffle",
    method: "put",
    params: {
      state: shuffle,
      device_id: deviceId
    },
    headers: {
      "Authorization": tokenAuth,
      "Accept": "application/json",
      "Content-Type": " application/json"
    }
  };
  let response = await axios(options).catch((error) => errorHandling(error, "toggleShuffle"));
  if (response != null) {
    return true;
  }
  return null;
}