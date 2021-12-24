import axios from 'axios';
import { errorHandling } from '../errorHandling.js';

export async function getDevices(tokenInfo) {
  var options = {
    url: 'https://api.spotify.com/v1/me/player/devices',
    method: 'get',
    headers: {
      'Authorization': `${tokenInfo.token_type} ${tokenInfo.access_token}`,
      "Accept": "application/json",
      "Content-Type": " application/json"
    }
  };
  let response = await axios(options).catch((error) => errorHandling(error, "getDevices"));
  return response;
}