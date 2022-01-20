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

export async function getPlaylistSongs(tokenAuth,playlistId) {
  var options = {
    url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    method: "get",
    params: {
      fields: "items(track.uri, track.name, track.artists.name), next"
    },
    headers: {
      "Authorization": tokenAuth,
      "Accept": "application/json",
      "Content-Type": " application/json"
    }
  };
  let response = await axios(options).catch((error) => errorHandling(error, "getPlaylistSongs"));
  return response;
}

export async function getPlaylistSongsNextUrl(tokenAuth, nextUrl) {
  var options = {
    url: nextUrl,
    method: "get",
    headers: {
      "Authorization": tokenAuth,
      "Accept": "application/json",
      "Content-Type": " application/json"
    }
  };
  let response = await axios(options).catch((error) => errorHandling(error, "getPlaylistSongsNextUrl"));
  return response;
}