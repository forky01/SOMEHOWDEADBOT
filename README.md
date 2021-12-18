# BOT

## Installation

Clone this repo at `git clone https://github.com/forky01/SOMEHOWDEADBOT.git`

``` sh
npm install
```

_NOTE:_ discord.js-v13 requires >= Node 16.6

spotify

```sh
npm install express http-proxy-middleware 
```

## commands

When updating commands run: `node deploy-commands.js`

Global commands are cached for one hour. New global commands will fan out slowly across all guilds and will only be guaranteed to be updated after an hour. Guild commands update instantly. As such, we recommend you use guild-based commands during development and publish them to global commands when they're ready for public use.

### bot scopes

* bot

* application.commands

## Auth process

https://developer.spotify.com/documentation/general/guides/authorization/code-flow/