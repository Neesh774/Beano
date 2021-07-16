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
	run: async (client, message, args) => {
		// command
		if(!message.member.permissions.has('MANAGE_MESSAGES')) {
			return message.reply('You don\'t have permissions for that :/');
		}
		if(!args[0]) {
			return message.reply('You need to give me someone to mute!');
		}
		const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
		if (!member) return message.reply({ content: '**User Is Not In The Guild**' });
		if (member === message.member) return message.reply({ content: '**You Cannot Mute Yourself**' });
		const AC = await client.guilds.fetch(config.AC);
		const logs = await AC.channels.cache.get(config.logs);
		if(member.roles.cache.has('838076447095914526')) {
			return message.reply('That user is already muted.');
		}
		if(!args[1]) {
			member.roles.add(message.guild.roles.cache.get(config.mutedRole));
			member.send({ content:`You were muted in ${message.guild.name}` });
			return message.reply(`Muted ${member.toString()}`);
		}
		else{
			let time;
			try{
				time = ms(args[1]);
			}
			catch(e) {return message.reply({ content: ':x: There was an error. Please make sure you\'re using the proper arguments and try again.' });}
			member.roles.add(message.guild.roles.cache.get(config.mutedRole));
			member.send({ content: `You were muted in ${message.guild.name} for ${args[1]}` });
			setTimeout(() => {
				member.send({ content: 'You were unmuted in ' + message.guild.name });
				member.roles.remove(message.guild.roles.cache.get(config.mutedRole));
			}, time);
			return message.reply(`Muted ${member.toString()}`);
		}
	},
};