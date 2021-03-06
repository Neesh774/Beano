const Discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'guildMemberUpdate',
	async execute(oldMember, newMember, client) {
		if (newMember.guild.id != config.AC) return;
		const AC = await client.guilds.fetch(config.AC);
		const logs = await AC.channels.cache.get(config.logs);
		let updated = false;
		let embed = false;
		if (oldMember.nickname != newMember.nickname) {
			embed = new Discord.MessageEmbed(client, newMember.guild)
				.setColor('#ffdc40')
				.setDescription(`**${newMember.toString()} nickname changed**`)
				.setFooter(`ID: ${newMember.id}`)
				.setAuthor(newMember.user.tag, newMember.user.displayAvatarURL())
				.addFields(
					{ name: 'Before:', value: `${oldMember.nickname ? oldMember.nickname : '*None*'}`, inline: true },
					{ name: 'After:', value: `${newMember.nickname ? newMember.nickname : '*None*'}`, inline: true })
				.setTimestamp();
			updated = true;
		}
		const rolesAdded = newMember.roles.cache.filter(x => !oldMember.roles.cache.get(x.id));
		const rolesRemoved = oldMember.roles.cache.filter(x => !newMember.roles.cache.get(x.id));
		if (rolesAdded.size != 0 || rolesRemoved.size != 0) {
			const roleAddedString = [];
			rolesAdded.each(x => roleAddedString.push(x.toString()));
			const roleRemovedString = [];
			rolesRemoved.each(x => roleRemovedString.push(x.toString()));
			embed = new Discord.MessageEmbed(client, newMember.guild)
				.setColor(config.embedColor)
				.setDescription(`**${newMember.toString()} roles changed**`)
				.setFooter(`ID: ${newMember.id}`)
				.setAuthor(newMember.user.tag, newMember.user.displayAvatarURL())
				.addFields(
					{ name: `Added roles [${rolesAdded.size}]:`, value: `${roleAddedString.length == 0 ? '*None*' : roleAddedString.join('\n ')}`, inline: true },
					{ name: `Removed Roles [${rolesRemoved.size}]:`, value: `${roleRemovedString.length == 0 ? '*None*' : roleRemovedString.join('\n ')}`, inline: true })
				.setTimestamp();
			updated = true;
		}
		if (updated) logs.send({ embeds: [embed] });
	},
};