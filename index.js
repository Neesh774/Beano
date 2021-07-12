// Modules
const { Client, Collection, Intents } = require('discord.js');
const functions = require('./functions.js');
const config = require('./config.json');
const fs = require('fs');
const mongoose = require('mongoose');
const badwords = require('./nonowords.json');
const client = new Client({
// Stops the bot from mentioning @everyone
	allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES],
});

// Command Handler
client.commands = new Collection();
client.slashcommands = new Collection();
client.aliases = new Collection();
client.queue = new Map();
client.coolDowns = new Set();
client.autoResponseCoolDowns = new Set();
client.ccCoolDowns = new Set();
// Command Folder location
client.categories = fs.readdirSync('./commands/');
['command', 'slashcommands', 'event'].forEach(handler => {
	require(`./handlers/${handler}`)(client);
});

// Bot Status
client.on('ready', async () => {
    const data = [];
    client.slashcommands.forEach(cmd => {
        if(cmd.options) {
            data.push(
                {
                    name: cmd.name,
                    description: cmd.description,
                    options: cmd.options,
                });
        }
        else{
            data.push(
                {
                    name: cmd.name,
                    description: cmd.description,
                });
        }
    });
    const AC = client.guilds.cache.get(config.AC);
    const commands = await AC.commands.set(data);
    console.log('Slash commands deployed successfully.')
	console.log(`Bot User ${client.user.username} has been logged in and is ready to use!`);
	client.user.setActivity('!bhelp', { type: 'WATCHING' });
	functions.connectMongoose(mongoose);
});

client.on('messageCreate', async message => {
    // Loads prefix from config.json
    const prefix = (config.prefix);
    // Makes sure bot wont respond to other bots including itself
    if (message.system || message.author.bot) return;
    // Checks if the command is from a server and not a dm
    if (!message.guild) return;
    for(var i = 0;i < badwords.badwords.length;i++){
        if(message.content.toLowerCase().includes(badwords.badwords[i].toLowerCase())){
            message.delete().then(msg =>{
                functions.warn(message.member, message.guild, message.channel, 'no no word', client);
                msg.channel.send({ content: 'SMH MY HEAD NO NO WORD' });
            })
        }
    }
    functions.levelUser(message, client)
    await functions.sendAutoResponse(message, client);
    // Checks if the command starts with a prefix
    if (!message.content.startsWith(prefix)) return;
    // Makes sure bot wont respond to other bots including itself
    if (!message.member) message.member = await message.guild.fetchMember(message);

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) return;
    await functions.sendCustomCommand(message, client);
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
	if (command) {
		command.run(client, message, args);
	}

});

// Log into discord using the token in config.json
client.login(config.token);