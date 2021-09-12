const Discord = require('discord.js');
const config = require('../../config.json');
const sSchema = require('../../models/suggestschema');
module.exports = {
	name: 'suggestdel',
	category: 'Custom Commands and Auto Reponses',
	description: 'Deletes a certain suggestion',
	usage: `${config.prefix}suggestdel <suggestion ID>`,
	options: [
		{
			name: 'suggestion_id',
			type: 'INTEGER',
			description: 'The ID of the suggestion you want to delete',
			required: true,
		},
	],
	run: async (client, interaction) => {
		// command
		const numSuggests = await sSchema.countDocuments({});
		const fields = [];
		if (!message.member.permissions.has('MANAGE_MESSAGES')) {
			return interaction.editReply('You don\'t have permissions for that :/');
		}
		if (!args[0]) {
			return interaction.editReply('Which suggestion am I deleting?');
		}
		if (args[0] > numSuggests) {
			return interaction.editReply('That command doesn\'t exist!');
		}
		const suggest = await sSchema.findOne({ id: args[0] });
		await sSchema.deleteOne({ id: args[0] });
		for (let i = suggest.id + 1;i < numSuggests + 1; i++) {
			const nextSuggest = await sSchema.findOne({ id:i });
			nextSuggest.id--;
			await nextSuggest.save();
		}
		const AC = await client.guilds.fetch(config.AC);
		const suggestChannel = await AC.channels.cache.get(config.suggestions);

		const sMessage = await suggestChannel.messages.fetch(suggest.messageID);
		await sMessage.delete();
		interaction.editReply(`Suggestion with content ${suggest.suggestion} successfully deleted!`);
		const logs = await AC.channels.cache.get(config.logs);
		const embed = new Discord.MessageEmbed()
			.setColor(config.embedColor)
			.setTitle('Suggestion Deleted')
			.setTimestamp()
			.setDescription(`Suggestion with content ${suggest.suggestion} was cleared by user ` + message.user.tag);
		return logs.send({ embeds: [embed] });
	},
};