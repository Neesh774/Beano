// Modules
const { Client, Collection, Intents } = require('discord.js');
const databaseFuncs = require('./functions/databaseFuncs');
const messageFuncs = require('./functions/messageFuncs');
const config = require('./config.json');
const token = require('./token.json');
const fs = require('fs');
const mongoose = require('mongoose');
const badwords = require('./nonowords.json');
const mSchema = require('./models/memberschema');
const Filter = require('badwords-filter');
const client = new Client({
// Stops the bot from mentioning @everyone
	allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MEMBERS],
});
const automodFilter = {
    list: badwords.badwords,
    cleanWith: '*',
    useRegex: true,
};
const filter = new Filter(automodFilter);
// Command Handler
client.slashcommands = new Collection();
client.aliases = new Collection();
client.queue = new Map();
client.coolDowns = new Set();
client.autoResponseCoolDowns = new Set();
client.ccCoolDowns = new Set();
client.lockedChannels = new Set();
client.lockDown = false;
// Command Folder location
client.categories = fs.readdirSync('./slashcommands/');
['slashcommands', 'event'].forEach(handler => {
	require(`./handlers/${handler}`)(client);
});

// Bot Status
client.on('ready', async () => {
	try {
		const data = [];
		client.slashcommands.forEach(cmd => {
			if (cmd.options) {
				data.push(
					{
						name: cmd.name,
						description: cmd.description,
						options: cmd.options,
						// defaultPermission: !cmd.moderation,
					});
			}
			else {
				data.push(
					{
						name: cmd.name,
						description: cmd.description,
						// defaultPermission: !cmd.moderation,
					});
			}
		});
		const AC = client.guilds.cache.get(config.AC);
		await AC.commands.set(data);
		console.log('Slash commands deployed successfully.');
		console.log(`Bot User ${client.user.username} has been logged in and is ready to use!`);
		client.user.setActivity('!bhelp', { type: 'WATCHING' });
		databaseFuncs.connectMongoose(mongoose);
		await databaseFuncs.cacheMessages(client);
	}
	catch (e) {
		console.log(e);
	}
});

client.on('messageCreate', async message => {
	// Loads prefix from config.json
	const prefix = (config.prefix);
	// Makes sure bot wont respond to other bots including itself
	if (message.system || message.author.bot) return;
	// Checks if the command is from a server and not a dm
	if (!message.guild) return;
	if (filter.isUnclean(message.content)) {
        message.delete().then(msg => {
            databaseFuncs.warn(message.member, message.guild, message.channel, 'no no word', client, message, false);
            msg.channel.send({ content: 'SMH MY HEAD NO NO WORD' }).then(m => setTimeout(() => m.delete(), 5000));
        });
    }
	const member = mSchema.findOne({ userID: message.author.id });
	await messageFuncs.sendAutoResponse(message, client);
	// Checks if the command starts with a prefix
	if (!message.content.startsWith(prefix)) return;
	// Makes sure bot wont respond to other bots including itself
	if (!message.member) message.member = await message.guild.fetchMember(message);

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();
	if (cmd.length === 0) return;
	await messageFuncs.sendCustomCommand(message, client);

});

// Log into discord using the token in config.json
client.login(token.token);