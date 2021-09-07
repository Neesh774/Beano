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
			return message.editReply('You don\'t have permissions for that :/');
		}
		if(!args[0]) {
			return message.editReply('You need to give me someone to mute!');
		}
		const member = await message.guild.members.fetch(args[0]);
		if (!member) return message.editReply({ content: '**User Is Not In The Guild**' });
		if (member === message.member) return message.editReply({ content: '**You Cannot Mute Yourself**' });
		const AC = await client.guilds.fetch(config.AC);
		const logs = await AC.channels.cache.get(config.logs);
		if(member.roles.cache.has('838076447095914526')) {
			return message.editReply('That user is already muted.');
		}
		if(!args[1]) {
			member.roles.add(message.guild.roles.cache.get(config.mutedRole));
			member.send({ content:`You were muted in ${message.guild.name}` });
			return message.editReply(`Muted ${member.toString()}`);
		}
		else{
			let time;
			try{
				time = ms(args[1]);
			}
			catch(e) {return message.editReply({ content: ':x: There was an error. Please make sure you\'re using the proper arguments and try again.' });}
			member.roles.add(message.guild.roles.cache.get(config.mutedRole));
			member.send({ content: `You were muted in ${message.guild.name} for ${args[1]}` });
			setTimeout(() => {
				member.send({ content: 'You were unmuted in ' + message.guild.name });
				member.roles.remove(message.guild.roles.cache.get(config.mutedRole));
			}, time);
			return message.editReply(`Muted ${member.toString()}`);
		}
	},
};