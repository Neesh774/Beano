const Discord = require('discord.js');
const config = require('../../config.json');
const ccSchema = require('../../models/ccschema.js');
module.exports = {
	name: 'ccclearall',
	category: 'Custom Commands and Auto Reponses',
	description: 'Clears all custom commands',
	usage: `${config.prefix}ccclearall`,
	moderation: true,
	run: async (client, interaction) => {
		await ccSchema.deleteMany();
		const AC = await client.guilds.fetch(config.AC);
		const logs = await AC.channels.cache.get(config.logs);
		const embed = new Discord.MessageEmbed()
			.setColor(config.embedColor)
			.setTitle('Commands were cleared')
			.setTimestamp()
			.setDescription('Commands were cleared by user ' + interaction.user.tag);
		logs.send({ embeds: [embed] });
		return interaction.editReply('Successfully cleared the commands list!');

	},
};