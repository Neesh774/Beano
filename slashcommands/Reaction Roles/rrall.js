const Discord = require('discord.js');
const config = require('../../config.json');
const rrSchema = require('../../models/rrschema.js');
module.exports = {
	name: 'rrall',
	category: 'Reaction Roles',
	description: 'Displays all current reaction roles',
	usage: `${config.prefix}rrall`,
	options: [],
	run: async (client, interaction) => {
		const numRRs = await rrSchema.countDocuments();
		const fields = [];
		for (let i = 1;i < numRRs + 1; i++) {
			const schema = await rrSchema.findOne({ id: i });
			const msgchannel = await interaction.guild.channels.cache.get(schema.channelID);
			const msg = await msgchannel.messages.fetch(schema.messageID);
			fields.push({ 'name': `ID: #${i}`, 'value': `[Jump to ${msgchannel.toString()}](${msg.url})` });
		}
		const embed = new Discord.MessageEmbed()
			.setColor(config.embedColor)
			.setTitle('Reaction Roles for ' + interaction.guild.name)
			.addFields(fields);
		return interaction.editReply({ embeds: [embed] });
	},
};