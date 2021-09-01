require('dotenv').config();
// const Discord = require('discord.js');
// const bot = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILDS]});

// bot.on('ready', () => {
//   console.info(`Logged in as ${bot.user.tag}!`);
// });

// bot.on('messageCreate', msg => {
//   console.info('bob');
//   if (msg.content === 'p') {
//     msg.reply('pong');
//     msg.channel.send('pong');
//   }
// });

// bot.on('interactionCreate', interaction => {
// 	console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
// });

// bot.on('error', err => {
//   console.info('sup');
// });

//   const TOKEN = process.env.DISCORD_TOKEN;

// bot.login(TOKEN);


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