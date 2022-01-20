# BOT

## 🔧 Installation

Clone this repo at `git clone https://github.com/forky01/SOMEHOWDEADBOT.git`

```sh
npm install
```

_NOTE:_ discord.js-v13 requires >= Node 16.6

### 📝 .env file

Create a `.env` file with the following variables:

- DISCORD_TOKEN

- SPOTIFY_CLIENT_ID

- SPOTIFY_CLIENT_SECRET

How to get each value is explained in Bot and Spotify Setup

### 🤖 Bot setup

Create an _application_ at <https://discord.com/developers/applications>.

Then add a bot -> in the side nav bar under _settings_ -> _Bot_: The click the `Add Bot` Button

Grab DISCORD_TOKEN value:

- Under _settings_ -> _Bot_: copy the `TOKEN` and store as `DISCORD_TOKEN` in your _.env_ file

To add the bot to a server:

- Under _settings_ -> _OAuth2 tab_ -> _URL generator_: select the following scopes `bot`, `application.commands` and any relevant bot permissions.

### 🎸 Spotify Setup

Create an _app_ at <https://developer.spotify.com/dashboard>.

Settings to Modify:

- Go to _Edit settings_: add the redirect uri for the auth process (e.g. <http://localhost:5000/auth/callback>)

- _Note_: If `App Status` is in `development mode`: Up to 25 Spotify users can install and use your app. These users must be explicitly added under the section "Users and Access" before they can authenticate with your app.

Grab SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET values:

- Under the app name and description, copy the `Client ID` and `Client Secret` and store as `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in your _.env_ file

---

## 📣 commands

When updating commands run: `node deploy-commands.js`

Global commands are cached for one hour. New global commands will fan out slowly across all guilds and will only be guaranteed to be updated after an hour. Guild commands update instantly. As such, we recommend you use guild-based commands during development and publish them to global commands when they're ready for public use.

---

## 🔐 Spotify auth process

<https://developer.spotify.com/documentation/general/guides/authorization/code-flow/>

## UserInfo/currentListeners data structures

```
user = {
  discordName: {
    state: (temp) used in auth process to identify the user when callback occurs
    msg: (temp) stores the msg which triggered the auth process

    accessToken
    tokenType
    scope
    expiresIn
    refreshToken
    expiresAt
    deviceId
  }
}
```

```
currentListeners = {
  voiceChannelId: {
    discordName: [tokenAuth, deviceId]
  }
}
```
