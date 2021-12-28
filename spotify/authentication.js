import axios from "axios";
import dotenv from "dotenv";
import open from "open";

import { errorHandling } from "../errorHandling.js";
import { addUser, getUsernameByKeyPair, setUser, removeKeyFromUser, getUserValue } from "../userInfo.js";

dotenv.config();
var spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
var redirectUri = "http://somehowdeadbot.a72oabv7crsku.ap-southeast-2.cs.amazonlightsail.com/somehowdeadbot/auth/callback";

export function authenticate(username, msg) {
  var state = generateRandomString(16);
  var url = generateAuthenticationURL(state);

  //store state for future identification of the user sending the request
  addUser(username, ["state", state], ["msg", msg]);

  open(url);
}

function generateAuthenticationURL(state) {
  //request authorisation
  var scope = "user-modify-playback-state user-read-playback-state";

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: redirectUri,
    state: state
  });

  var url = "https://accounts.spotify.com/authorize/?" + auth_query_parameters.toString();

  return url;
}

export async function authCallback(content) {
  var code, stateServer, err;
  //request access token
  var contentParams = content.split("&");
  for (var i = 0; i < contentParams.length; i++) {
    if (contentParams[i].startsWith("code")) {
      code = contentParams[i].split("=")[1];
    }
    else if (contentParams[i].startsWith("state")) {
      stateServer = contentParams[i].split("=")[1];
    }
    else if (contentParams[i].startsWith("error")) {
      err = contentParams[i].split("=")[1];
    }
  }

  var username = getUsernameByKeyPair("state", stateServer);
  var msg = getUserValue(username, "msg");

  if (username != null && msg != null) {
    if (err) {
      console.log(`${username} denied`);
      msg.react("👎");
    }
    if (code) {
      console.log(`Got code for ${username}`);
      var accessTokenResponse = await getAccessToken(code);
      if (accessTokenResponse != null) {
        var accessTokenInfo = accessTokenResponse.data;
        assignTokenToUser(username, accessTokenInfo);
        console.log(`Got token for ${username}`);
        open("spotify:open", {background:true}); //only opens in background for macOS
        msg.react("👌");
      }
    }
  }
  removeKeyFromUser(username, "msg");
}

function assignTokenToUser(username, accessTokenInfo) {
  setUser(username, "accessToken", accessTokenInfo["access_token"]);
  setUser(username, "tokenType", accessTokenInfo["token_type"]);
  setUser(username, "scope", accessTokenInfo["scope"]);
  setUser(username, "expiresIn", accessTokenInfo["expires_in"]);
  setUser(username, "refreshToken", accessTokenInfo["refresh_token"]);

  var today = new Date();
  var expiryInHours = accessTokenInfo["expires_in"] / 60 / 60;
  var expiryTime = `${today.getHours()+ expiryInHours}:${today.getMinutes()}:${today.getSeconds()}`;
  setUser(username, "expiresAt", expiryTime);

  //remove the state
  removeKeyFromUser(username, "state");
}

var generateRandomString = function (length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

async function getAccessToken(code) {
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    method: "POST",
    params: {
      code: code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code"
    },
    headers: {
      "Authorization": "Basic " + (Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString("base64")),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    responseType: "json"
  };

  let response = await axios(authOptions).catch((error) => errorHandling(error, "getAccessToken"));

  return response;
}

