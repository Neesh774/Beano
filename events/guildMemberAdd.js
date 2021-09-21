const Discord = require('discord.js');
const config = require('../config.json');
const mSchema = require('../models/memberschema.js');
const welcomes = require('../welcomes.json');
const databaseFuncs = require('../functions/databaseFuncs');
module.exports = {
	name: 'guildMemberAdd',
	async execute(member, client) {
		if (member.guild.id != config.AC) return;
		const AC = await client.guilds.fetch(config.AC);
		await databaseFuncs.createMember(member.user.username, member.user.id);

		const ranInt = Math.floor(Math.random() * welcomes.length);
		let message = welcomes[ranInt];
		message = message.replace('NAME', member.user.toString());
		message = message.replace('COUNT', member.guild.memberCount);
		const general = await member.guild.channels.fetch(config.general);
		general.send(message);

		const logs = await AC.channels.cache.get(config.logs);
		const embed = new Discord.MessageEmbed()
			.setColor(config.embedColor)
			.setTitle(`${member.user.username} has joined the server!`)
			.setThumbnail(member.user.avatarURL())
			.setTimestamp();
		return logs.send({ embeds: [embed] });
	},
};