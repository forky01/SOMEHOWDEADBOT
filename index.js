require('dotenv').config();
const { Client, Intents } = require('discord.js');
const TOKEN = process.env.DISCORD_TOKEN;

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
  console.info(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', msg => {
  if (msg.content === 'hello') {
    msg.channel.send('yoyo');
  }
  if (msg.content === 'ping') {
    msg.channel.send('pong');
  }
});

client.login(TOKEN);