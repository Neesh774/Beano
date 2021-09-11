const Discord = require('discord.js');
const config = require('../../config.json');
const ms = require('ms');
module.exports = {
	name: 'mute',
	category: 'moderation',
	description: 'Beano exiles the user to the land of the rats',
	usage: `${config.prefix}mute <user> [time]`,
	options: [
		{
			name: 'user',
			type: 'USER',
			description: 'The user to mute',
			required: true,
		},
		{
			name: 'time',
			type: 'STRING',
			description: 'How long Beano should mute them',
			required: false,
		},
	],
	moderation: true,
	run: async (client, message, args) => {
		// command
		if (!message.member.permissions.has('MANAGE_MESSAGES')) {
			return message.editReply('You don\'t have permissions for that :/');
		}
		if (!args[0]) {
			return message.editReply('You need to give me someone to mute!');
		}
		const member = await message.guild.members.fetch(args[0]);
		if (!member) return message.editReply({ content: '**User Is Not In The Guild**' });
		if (member === message.member) return message.editReply({ content: '**You Cannot Mute Yourself**' });
		const AC = await client.guilds.fetch(config.AC);
		const logs = await AC.channels.cache.get(config.logs);
		let logEmb;
		if (!member.roles.cache.has(config.cafeGuest)) {
			return message.editReply('That user is already muted.');
		}
		if (!args[1]) {
			member.roles.remove(message.guild.roles.cache.get(config.cafeGuest));
			member.send({ content:`You were muted in ${message.guild.name}` });
			message.editReply(`Muted ${member.toString()}`);
			logEmb = new Discord.MessageEmbed()
				.setTitle(`${member.user.username} Muted`)
				.setColor(config.embedColor)
				.addField('Moderator', message.user.toString(), true)
				.footer(`ID | ${member.id}`, member.user.displayAvatarURL());
		}
		else {
			let time;
			try {
				time = ms(args[1]);
			}
			catch (e) {return message.editReply({ content: ':x: There was an error. Please make sure you\'re using the proper arguments and try again.' });}
			member.roles.remove(message.guild.roles.cache.get(config.cafeGuest));
			member.send({ content: `You were muted in ${message.guild.name} for ${args[1]}` });
			setTimeout(() => {
				member.send({ content: 'You were unmuted in ' + message.guild.name });
				member.roles.remove(message.guild.roles.cache.get(config.cafeGuest));
			}, time);
			message.editReply(`Muted ${member.toString()}`);
			logEmb = new Discord.MessageEmbed()
				.setTitle(`${member.user.username} Muted for ${args[1]}`)
				.setColor(config.embedColor)
				.addField('Moderator', message.user.toString(), true)
				.footer(`ID | ${member.id}`, member.user.displayAvatarURL());
		}
		return logs.send(logEmb);
	},
};