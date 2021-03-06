const Discord = require('discord.js');
const config = require('../../config.json');
const mSchema = require('../../models/memberschema.js');
module.exports = {
	name: 'clearxp',
	category: 'levels',
	description: 'Beano will clear all of the xp',
	usage: `${config.prefix}clearxp`,
	options: [],
	run: async (client, interaction) => {
		// command
		if (!message.member.permissions.has('MANAGE_MESSAGES')) {
			return message.editReply('You don\'t have permissions for that :/');
		}
		await mSchema.deleteMany();
		message.editReply('Successfully cleared all of the levels!');
		const AC = await client.guilds.fetch(config.AC);
		const logs = await AC.channels.cache.get(config.logs);
		const embed = new Discord.MessageEmbed()
			.setColor(config.embedColor)
			.setTitle('Levels were cleared')
			.setTimestamp()
			.setDescription('All levels were cleared by user ' + message.user.toString());
		return logs.send({ embeds: [embed] });
	},
};