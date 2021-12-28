# BOT

## Installation

Clone this repo at `git clone https://github.com/forky01/SOMEHOWDEADBOT.git`

```sh
npm install
```

_NOTE:_ discord.js-v13 requires >= Node 16.6

### Bot setup

<https://discord.com/developers/applications> -> create application and get DISCORD_TOKEN

To add to server:

- OAuth2 tab -> URL generator: then select the following scopes `bot`, `application.commands` and any relevant bot permissions.

### Spotify Setup

<https://developer.spotify.com/dashboard> -> create app and get SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET

- Edit settings: add the redirect uri for the auth process (e.g. <http://localhost:5000/auth/callback>)

## commands

When updating commands run: `node deploy-commands.js`

Global commands are cached for one hour. New global commands will fan out slowly across all guilds and will only be guaranteed to be updated after an hour. Guild commands update instantly. As such, we recommend you use guild-based commands during development and publish them to global commands when they're ready for public use.

## Auth process

<https://developer.spotify.com/documentation/general/guides/authorization/code-flow/>
