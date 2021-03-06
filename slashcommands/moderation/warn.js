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
		if (!interaction.member.permissions.has('KICK_MEMBERS')) {
			return interaction.editReply('You don\'t have permissions for that :/');
		}
		const reason = interaction.options.getString('reason') ?? 'No reason given';
		const AC = await client.guilds.fetch(config.AC);
		const member = interaction.options.getMember('user');

		functions.warn(member, interaction.guild, interaction.channel, reason, client, interaction, true);
	},
};
