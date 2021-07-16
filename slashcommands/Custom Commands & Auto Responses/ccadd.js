const Discord = require('discord.js');
const config = require('../../config.json');
const ccSchema = require('../../models/ccschema.js');
module.exports = {
	name: 'ccadd',
	category: 'Custom Commands and Auto Reponses',
	description: 'Creates a new custom command',
	usage: `${config.prefix}ccadd <trigger> <response URL> [another response URL] [another response URL]...`,
	options: [
		{
			name: 'trigger',
			type: 'STRING',
			description: 'The phrase that will trigger the custom command',
			required: true,
		},
		{
			name: 'response1',
			type: 'STRING',
			description: 'The url, or phrase, that will be sent when someone uses this command',
			required: true,
		},
		{
			name: 'response2',
			type: 'STRING',
			description: 'The url, or phrase, that will be sent when someone uses this command',
			required: false,
		},
		{
			name: 'response3',
			type: 'STRING',
			description: 'The url, or phrase, that will be sent when someone uses this command',
			required: false,
		},
		{
			name: 'response4',
			type: 'STRING',
			description: 'The url, or phrase, that will be sent when someone uses this command',
			required: false,
		},
		{
			name: 'response5',
			type: 'STRING',
			description: 'The url, or phrase, that will be sent when someone uses this command',
			required: false,
		},
	],
	run: async (client, message, args) => {
		// command
		const numCommands = await ccSchema.countDocuments({});
		if(!message.member.permissions.has('MANAGE_MESSAGES')) {
			return message.reply('You don\'t have permissions for that :/');
		}
		if(!args[0]) {
			return message.reply('You need to give me a trigger!');
		}
		if(!args[1]) {
			return message.reply('You need to give me atleast one response!');
		}
		const trigger = args[0];
		args.splice(0, 1);
		const responses = args;
		const cc = new ccSchema({
			id: numCommands + 1,
			trigger: trigger,
			responsesArray: responses,
			created: message.createdAt.toUTCString(),
			createdByID: message.author.id,
		});
		cc.save().catch(err => console.log(err));
		const fields = [];
		for(var i = 0;i < responses.length;i++) {
			fields.push({ 'name':`Response #${i + 1}`, 'value': responses[i] });
		}
		const embed = new Discord.MessageEmbed()
			.setColor(config.embedColor)
			.setTimestamp()
			.setTitle('Custom Command Created')
			.setDescription(`A custom command was created by ${message.author.tag}`)
			.addField('Trigger', trigger)
			.addFields(fields);
		const AC = await client.guilds.fetch(config.AC);
		const logs = await AC.channels.cache.get(config.logs);
		logs.send({ embeds: [embed] });
		return message.reply({ embeds: [embed] });
	},
};