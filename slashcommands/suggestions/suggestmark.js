const Discord = require('discord.js');
const config = require('../../config.json');
const sSchema = require('../../models/suggestschema');
module.exports = {
	name: 'suggestmark',
	category: 'suggestions',
	description: 'Marks the given suggestion with the given status',
	usage: `${config.prefix}suggestmark <suggestion id> <Dead|In_Progress|Done> [reason]`,
	options: [
		{
			name: 'suggestion_id',
			type: 'INTEGER',
			description: 'The ID of the suggestion you want to mark',
			required: true,
		},
		{
			name: 'mark',
			type: 'STRING',
			description: 'The status you want to give to the suggestion',
			required: true,
			choices: [
				{
					name: 'Rejected',
					value: 'dead',
				},
				{
					name: 'Undertaken',
					value: 'in_progress',
				},
				{
					name: 'Implemented',
					value: 'done',
				},
			],
		},
		{
			name: 'reason',
			type: 'STRING',
			description: 'The reason you\'re marking this suggestion',
			required: false,
		},
	],
	run: async (client, message, args) => {
		// command
		const numSuggest = await sSchema.countDocuments({});
		if (!message.member.permissions.has('MANAGE_MESSAGES')) {
			return message.editReply('You don\'t have permissions for that :/');
		}
		if (!args[0]) {
			return message.editReply('Which suggestion do you want me to mark?');
		}
		if (args[0] > numSuggest) {
			return message.editReply('That suggestion doesn\'t exist!');
		}
		if (!args[1] || (args[1].toLowerCase() != 'dead' && args[1].toLowerCase() != 'in_progress' && args[1].toLowerCase() != 'done')) {
			return message.editReply('Please make sure you are marking it as either `Dead`, `In_Progress`, or `Done`');
		}
		const suggest = await sSchema.findOne({ id: args[0] }).exec();
		const mark = args[1];
		const suggestAuthor = suggest.createdBy;
		const index = args[0];
		suggest.status = mark;
		if (args[2]) {
			args.splice(0, 2);
			const reason = args.join(' ');
			suggest.reason = reason;
		}
		else {
			suggest.reason = 'N/A';
		}
		suggest.save();
		const AC = await client.guilds.fetch(config.AC);
		const suggestChannel = await AC.channels.cache.get(config.suggestions);

		const sMessage = await suggestChannel.messages.fetch(suggest.messageID);
		if (suggest.status === 'dead') {
			const newSuggest = new Discord.MessageEmbed()
				.setColor(config.embedColor)
				.setTitle(`Suggestion #${index} marked as rejected`)
				.setDescription(`${suggest.suggestion}`)
				.addField('Status', 'Dead')
				.addField('Reason', `${suggest.reason}`);
			await sMessage.edit({ embeds: [newSuggest] });
		}
		else if (suggest.status === 'in_progress') {
			const newSuggest = new Discord.MessageEmbed()
				.setColor(config.embedColor)
				.setTitle(`Suggestion #${index} marked as undertaken!`)
				.setDescription(`${suggest.suggestion}`)
				.addField('Status', 'In Progress')
				.addField('Reason', `${suggest.reason}`);
			await sMessage.edit({ embeds: [newSuggest] });
		}
		else if (suggest.status === 'done') {
			const newSuggest = new Discord.MessageEmbed()
				.setColor(config.embedColor)
				.setTitle(`Suggestion #${index} marked as implemented`)
				.setDescription(`${suggest.suggestion}`)
				.addField('Status', 'Implemented')
				.addField('Reason', `${suggest.reason}`);
			await sMessage.edit({ embeds: [newSuggest] });
		}
		const embed = new Discord.MessageEmbed()
			.setColor(config.embedColor)
			.setTitle('Suggestion #' + index + ' updated successfully!')
			.setDescription(`${suggest.suggestion}`)
			.addField('Status', `${suggest.status}`)
			.addField('Reason', `${suggest.reason}`)
			.setAuthor(suggest.createdBy, suggest.createdByIcon);
		return message.editReply({ embeds: [embed] });
	},
};