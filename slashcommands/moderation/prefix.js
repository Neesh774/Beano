const Discord = require('discord.js');
const config = require('../../config.json');
module.exports = {
	name: 'prefix',
	category: 'moderation',
	description: 'Beano changes it\'s own prefix!',
	usage: `${config.prefix}prefix <prefix>`,
	options: [
		{
			name: 'prefix',
			type: 'STRING',
			description: 'The new prefix',
			required: true,
		},
	],
	moderation: true,
	run: async (client, message, args) => {
		// command
		if (!message.member.permissions.has('MANAGE_MESSAGES')) {
			return message.editReply('You don\'t have permissions for that :/');
		}
		if (!args[0]) {
			return message.editReply('You need to give me a new prefix!');
		}
		config.prefix = args[0];
	},
};