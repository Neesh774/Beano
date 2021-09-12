const Discord = require('discord.js');
const config = require('../../config.json');
module.exports = {
	name: 'role',
	category: 'moderation',
	description: 'Beano gives the user whatever role you tell it to',
	usage: `${config.prefix}role <user> <role name>`,
	options: [
		{
			name: 'user',
			type: 'USER',
			description: 'The user to give the role to',
			required: true,
		},
		{
			name: 'role',
			type: 'ROLE',
			description: 'The role to give them',
			required: true,
		},
	],
	moderation: true,
	run: async (client, interaction) => {
		// command
		if (!message.member.permissions.has('MANAGE_MESSAGES')) {
			return interaction.editReply('You don\'t have permissions for that :/');
		}
		const role = await message.guild.roles.fetch(args[1]);
		if (!role) {
			return interaction.editReply(`Couldn't find role ${args[1]} >_<`);
		}
		const AC = await client.guilds.fetch(config.AC);
		const member = await AC.members.fetch(args[0]);
		if (member.roles.cache.has(role.id)) {
			member.roles.remove(role.id);
			return interaction.editReply(`Removed the role ${role.name} from ${member.nickname}`);
		}
		member.roles.add(role);
		return interaction.editReply(`Gave ${member.user.username} the role ${role.name}`);
	},
};