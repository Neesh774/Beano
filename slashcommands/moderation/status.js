const Discord = require('discord.js');
const config = require('../../config.json');
module.exports = {
	name: 'status',
	category: 'moderation',
	description: 'Beano changes its status.',
	usage: `${config.prefix}role <new_status>`,
	options: [
        {
            name: 'type',
            description: 'The type of the status',
            type: 'STRING',
            choices: [
                {
                    name: 'playing',
                    value: 'PLAYING',
                },
                {
                    name: 'streaming',
                    value: 'STREAMING',
                },
                {
                    name: 'listening',
                    value: 'LISTENING',
                },
                {
                    name: 'watching',
                    value: 'WATCHING',
                },
            ],
            required: true,
        },
		{
            name: 'status',
            description: 'Beano\'s new status',
            type: 'STRING',
            required: true,
        },
	],
	moderation: true,
	run: async (client, interaction) => {
        const type = interaction.options.getString('type');
		const status = interaction.options.getString('status', { type: type });
        client.user.setActivity(status);
        interaction.editReply(`Set the status to ${type }${status}!`);
	},
};