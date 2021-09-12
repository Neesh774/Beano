const Discord = require('discord.js');
const sSchema = require('../../models/suggestschema');
const config = require('../../config.json');

module.exports = {
	name: 'suggestionsclear',
	category: 'suggestions',
	description: 'Clears all pending suggestions',
	usage: `${config.prefix}suggestionsclear`,
	options: [],
	run: async (client, interaction) => {
		// command
		if (!message.member.permissions.has('MANAGE_MESSAGES')) {
			return interaction.editReply('You don\'t have permissions for that :/');
		}
		await sSchema.deleteMany();
		const AC = await client.guilds.fetch(config.AC);
		const logs = await AC.channels.cache.get(config.logs);
		const embed = new Discord.MessageEmbed()
			.setColor(config.embedColor)
			.setTitle('Suggestions were cleared')
			.setTimestamp()
			.setDescription('Suggestions were cleared by user ' + message.user.username);
		logs.send({ embeds: [embed] });
		return interaction.editReply('Successfully cleared the suggestions list!');
	},
};