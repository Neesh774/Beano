const ms = require('ms');
const functions = require('../../functions/messageFuncs');
const config = require('../../config.json');

module.exports = {
	name: 'remindme',
	description: 'Set a reminder',
	args: true,
	usage: `${config.prefix}remindme <time> <reminder>`,
	options: [
		{
			name: 'time',
			type: 'STRING',
			description: 'The time in which Beano will remind you',
			required: true,
		},
		{
			name: 'reminder',
			type: 'STRING',
			description: 'The actual reminder',
			required: true,
		},
	],
	run: async (client, interaction) => {
		const timeArg = args[0];
		functions.setReminder(message, timeArg, args[1]);
	},
};