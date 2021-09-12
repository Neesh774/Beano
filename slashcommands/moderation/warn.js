const Discord = require('discord.js');
const functions = require('../../functions/databaseFuncs');
const config = require('../../config.json');

module.exports = {
	name: 'warn',
	category: 'moderation',
	description: 'Warns the given user. 2 Warns = 2 Hour Mute, 4 Warns = Kick',
	usage: `${config.prefix}warn <user> [reason]`,
	options: [
		{
			name: 'user',
			type: 'USER',
			description: 'The user you want to warn',
			required: true,
		},
		{
			name: 'reason',
			type: 'STRING',
			description: 'The reason you want to warn them',
			required: false,
		},
	],
	moderation: true,
	run: async (client, interaction) => {
		if (!message.member.permissions.has('KICK_MEMBERS')) {
			return interaction.editReply('You don\'t have permissions for that :/');
		}
		let reason;
		if (args[1]) {
			reason = args[1];
		}
		const AC = await client.guilds.fetch(config.AC);
		const member = await AC.members.fetch(args[0]);

		functions.warn(member, message.guild, message.channel, reason, client, interaction, true);
	},
};
