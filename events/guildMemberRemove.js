const Discord = require('discord.js');
const config = require('../config.json');
const mSchema = require('../models/memberschema');
module.exports = {
	name: 'guildMemberRemove',
	async execute(member, client) {
		if (member.guild.id != config.AC) return;
		const userProfile = await mSchema.deleteOne({ memberID: member.id });
		const AC = await client.guilds.fetch(config.AC);
		const logs = await AC.channels.cache.get(config.logs);
		const embed = new Discord.MessageEmbed()
			.setColor(config.embedColor)
			.setTitle(`${member.user.username} has left the server`)
			.setThumbnail(member.user.avatarURL())
			.setTimestamp();
		return logs.send({ embeds: [embed] });
	},
};