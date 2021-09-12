const Discord = require('discord.js');
const config = require('../../config.json');
const arSchema = require('../../models/arschema.js');
module.exports = {
	name: 'arclearall',
	category: 'Custom Commands and Auto Reponses',
	description: 'Clears all auto responders',
	usage: `${config.prefix}arclearall`,
	options: [],
	run: async (client, interaction) => {
		if (!message.member.permissions.has('MANAGE_MESSAGES')) {
			return interaction.editReply('You don\'t have permissions for that :/');
		}
		await arSchema.deleteMany();
		const AC = await client.guilds.fetch(config.AC);
		const logs = await AC.channels.cache.get(config.logs);
		const embed = new Discord.MessageEmbed()
			.setColor(config.embedColor)
			.setTitle('Responders were cleared')
			.setTimestamp()
			.setDescription('Responders were cleared by user ' + message.user.tag);
		logs.send({ embeds: [embed] });
		return interaction.editReply('Successfully cleared the commands list!');

	},
};