const Discord = require('discord.js');
const config = require('../../config.json');
module.exports = {
	name: 'status',
	category: 'moderation',
	description: 'Beano changes its status.',
	usage: `${config.prefix}role <new_status>`,
	options: [
		{
            name: 'status',
            description: 'Status of the command',
            type: 'STRING',
            required: true,
        },
	],
	moderation: true,
	run: async (client, interaction) => {
		const status = interaction.options.getRole('status');
        client.user.setActivity(status);
        interaction.editReply(`Set the status to ${status}!`);
	},
};