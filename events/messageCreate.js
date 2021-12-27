import { generateAuthButton } from "../spotify/authentication.js";
import { resume, play } from "../spotify/functionality.js";

const prefix = "~";

export const name = "messageCreate";
export const once = false;
export async function execute(msg) {
  if (msg.author.bot) return; //don"t do anything if its from the bot
  if (!msg.content.startsWith(prefix)) return; // don"t bother checking the rest

  var username = msg.author.username;
  var channel = msg.channel;

  if (msg.content.startsWith(`${prefix}p`)) {
    // regex: ?<group-name>
    var commandArgs = msg.content.match(new RegExp(`${prefix}p https://open.spotify.com/(?<type>[a-z]+)/(?<id>[a-zA-Z0-9]+)?.+`));
    if (commandArgs) {
      var audioType = commandArgs.groups.type;
      var audioId = commandArgs.groups.id;
      await play(username, channel, audioType, audioId);
    }
    else {
      channel.send(`${prefix}p spotify-playlist`);
    }
  }
  else if (msg.content === `${prefix}s`) {
    channel.send("skip");
  }
  else if (msg.content === `${prefix}pause`) {
    channel.send("pause");
  }
  else if (msg.content === `${prefix}clear`) {
    channel.send("clear");
  }
  else if (msg.content === `${prefix}q`) {
    channel.send("queue");
  }
  else if (msg.content === `${prefix}l`) {
    var row = generateAuthButton(msg.author.username);
    channel.send({ content: username, components: [row] });
  }
  else if (msg.content === `${prefix}tp`) {
    await resume(username, channel);
  }
}


