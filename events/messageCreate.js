const prefix = "~";
module.exports = {
	name: 'messageCreate',
	once: false,
	execute(msg) {
		if (msg.author.bot) return; //don't do anything if its from the bot
    if (!msg.content.startsWith(prefix)) return; // don't bother checking the rest
    
    if (msg.content.startsWith(`${prefix}p`)) {
      var commandArgs = msg.content.match(new RegExp(`${prefix}p (?<song>(\\w+\\s*)+),\\s*(?<artist>(\\w+\\s*)+)`));
      if(commandArgs) {
        msg.channel.send(`play: song-${commandArgs.groups.song}, artist-${commandArgs.groups.artist}`);
      }
      else {
        msg.channel.send(`${prefix}p song, artist`);
      }
    }
    else if (msg.content === `${prefix}s`) {
      msg.channel.send('skip');
    }
    else if (msg.content === `${prefix}pause`) {
      msg.channel.send('pause');
    }
    else if (msg.content === `${prefix}clear`) {
      msg.channel.send('clear');
    }
    else if (msg.content === `${prefix}q`) {
      msg.channel.send('queue');
    }
	},
};