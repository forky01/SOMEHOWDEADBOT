import axios from 'axios';
import { errorHandling } from '../errorHandling.js';

export async function startPlayback(accessToken, tokenType, deviceId) {
  var options = {
    url: 'https://api.spotify.com/v1/me/player/play',
    method: 'put',
    params: {
      device_id: deviceId
    },
    // data: {
    //   uris: ["spotify:track:3cfOd4CMv2snFaKAnMdnvK"]
    // },
    headers: {
      'Authorization': `${tokenType} ${accessToken}`,
      "Accept": "application/json",
      "Content-Type": " application/json"
    }
  };
  let response = await axios(options).catch((error) => errorHandling(error, "play"));
  if (response != null) {
    return true;
  }
  return null;
}