import http from 'http';
import request from 'request';

var stateClient, accessTokenInfo;
import dotenv from 'dotenv'
dotenv.config();
var spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

export async function login   () {
  //request authorisation
  var scope = "streaming user-read-email user-read-private user-read-playback-state"
  stateClient = generateRandomString(16);

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: 'http://localhost:5000/auth/callback',
    state: stateClient
  })

  var url = 'https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString();
  
  //needs to be turned into a button since discord can't redirect to the user authorisation page
  console.log(url);
}



var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


export async function authCallback(content, resServer) {
	var code, stateServer, err;
  //request access/refresh token
  var contentParams = content.split("&");
  for (var i =0; i < contentParams.length; i++) {
    if (contentParams[i].startsWith("code")){
        code = contentParams[i].split("=")[1];
    }
    else if (contentParams[i].startsWith("status")){
      stateServer = contentParams[i].split("=")[1];
    }
    else if (contentParams[i].startsWith("error")){
      err = contentParams[i].split("=")[1];
    }
  }
  
  if(stateClient === stateServer) {
    if (err) {
      console.log("DENIED");     
    }
    if (code) {
      resServer.end();
      accessTokenInfo = await getAccessToken(code);
      await console.log(accessTokenInfo);
    }
  } 
}

export async function getAccessToken(code) {
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    form: {
      code: code,
      redirect_uri: "http://localhost:5000/auth/callback",
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    json: true
  };

  request.post (authOptions, (err, res, body) => {
    console.log(body);
    if (!err && res.statusCode === 200) {
      console.log("yes");
      return body;
    }
  });
}
