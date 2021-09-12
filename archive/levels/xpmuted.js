const Discord = require('discord.js');
const config = require('../../config.json');
const mcSchema = require('../../models/mchannelschema.js');
module.exports = {
	name: 'xpmuted',
	category: 'levels',
	description: 'Beano lists all the channels that are xp muted',
	usage: `${config.prefix}xpmuted`,
	options: [],
	run: async (client, interaction) => {
		// command
		const numMuted = await mcSchema.countDocuments();
		const fields = [];
		const list = await mcSchema.find({});
		const AC = await client.guilds.fetch(config.AC);
		for (let i = 0;i < numMuted; i++) {
			const channel = await AC.channels.cache.get(list[i].channel);
			fields.push({ 'name': `#${i + 1}`, 'value': `${channel.toString()}` });
		}
		const embed = new Discord.MessageEmbed()
			.setColor(config.embedColor)
			.setTitle('XP Muted Channels')
			.addFields(fields);
		return message.editReply({ embeds: [embed] });
	},
};