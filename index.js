require('dotenv').config();
const { Client, Intents } = require('discord.js');
const TOKEN = process.env.DISCORD_TOKEN;

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
  console.info(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', msg => {
  if (msg.content === 'bItcH') {
    msg.channel.send('no WoNk');
  }
  if (msg.content === 'p') {
    msg.channel.send('!p');
  }
});

client.login(TOKEN);