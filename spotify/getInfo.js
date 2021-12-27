import axios from "axios";
import { errorHandling } from "../errorHandling.js";

export async function getDevices(tokenAuth) {
  var options = {
    url: "https://api.spotify.com/v1/me/player/devices",
    method: "get",
    headers: {
      "Authorization": tokenAuth,
      "Accept": "application/json",
      "Content-Type": " application/json"
    }
  };
  let response = await axios(options).catch((error) => errorHandling(error, "getDevices"));
  return response;
}