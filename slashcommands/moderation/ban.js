const Discord = require('discord.js');
const config = require('../../config.json');
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'ban',
	category: 'moderation',
	description: 'bans a mentioned user',
	usage: `${config.prefix}ban <user> [reason]`,
	options: [
		{
			name: 'user',
			type: 'USER',
			description: 'The user to be banned',
			required: true,
		},
		{
			name: 'reason',
			type: 'STRING',
			description: 'The reason to ban them',
			required: false,
		},
	],
	run: async (client, message, args) => {
		const AC = await client.guilds.fetch(config.AC);
		const logs = await AC.channels.cache.get(config.logs);

		try {
			if (!message.member.permissions.has('BAN_MEMBERS') && !config.neesh.includes(message.user.id)) return message.editReply({ content: '**You Dont Have The Permissions To Ban Users! - [BAN_MEMBERS]**' });
			if (!message.guild.me.permissions.has('BAN_MEMBERS')) return message.editReply({ content: '**I Dont Have The Permissions To Ban Users! - [BAN_MEMBERS]**' });
			if (!args[0]) return message.editReply('**Please Provide A User To Ban!**');

			const banMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
			if (!banMember) return message.editReply({ content: '**User Is Not In The Guild**' });
			if (banMember === message.member) return message.editReply({ content: '**You Cannot Ban Yourself**' });

			var reason = args.slice(1).join(' ');

			if (!banMember.bannable) return message.editReply({ content: '**Cant Kick That User**' });
			try {
				message.guild.members.ban(banMember);
				banMember.send({ content: `**Hello, You Have Been Banned From ${message.guild.name} for - ${reason || 'No Reason'}**` }).catch(() => null);
			}
			catch {
				message.guild.members.ban(banMember);
			}
			if (reason) {
				var sembed = new MessageEmbed()
					.setColor(config.embedColor)
					.setDescription(`**${banMember.user.username}** has been banned for ${reason}`);
				message.editReply({ embeds: [sembed] });
			}
			else {
				var sembed2 = new MessageEmbed()
					.setColor(config.embedColor)
					.setDescription(`**${banMember.user.username}** has been banned`);
				message.editReply({ embeds: [sembed2] });
			}

			const embed = new MessageEmbed()
				.setColor(config.embedColor)
				.setThumbnail(banMember.user.displayAvatarURL({ dynamic: true }))
				.setFooter(message.guild.name, message.guild.iconURL())
				.addField('**Moderation**', 'ban')
				.addField('**Banned**', banMember.user.username)
				.addField('**ID**', `${banMember.id}`)
				.addField('**Banned By**', message.user.username)
				.addField('**Reason**', `${reason || '**No Reason**'}`)
				.addField('**Date**', message.createdAt.toLocaleString())
				.setTimestamp();
			logs.send({ embeds: [embed] });
		}
		catch (e) {
			console.log(e.stack);
			return message.editReply({ content:'**:x: Error, please try again**' });
		}
	},
};
