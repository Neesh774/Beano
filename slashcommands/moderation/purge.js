const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
	name: 'purge',
	category: 'moderation',
	description: 'Deletes messages in a text channel or specified number of messages in a text channel.',
	usage: `${config.prefix}purge <number of messages>`,
	options: [
		{
			name: 'num_messages',
			type: 'INTEGER',
			description: 'The number of messages to delete',
			required: true,
		},
	],
	moderation: true,
	run: async (client, message, args) => {
		const AC = await client.guilds.fetch(config.AC);
		const logs = await AC.channels.cache.get(config.logs);

		if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.editReply({ content: 'You Don\'t Have Sufficient Permissions!- [MANAGE_MESSAGES]' });

		if (args[0] > 99) {
			return message.editReply({ content: 'Please Supply A Number Less Than 100!' });
		}

		if (args[0] < 1) {return message.editReply({ content:'Please Supply A Number More Than 1!' });}
		const num = parseInt(args[0]);
		message.channel.bulkDelete(num + 1)
			.then(messages => message.editReply({ content: `Succesfully deleted \`${messages.size}/${num + 1}\` messages` }).then(msg => msg.delete({ timeout: 5000 }))).catch(() => {return message.editReply({ content: 'I Couldn\'t Delete The Messages!' });});
		const embed = new MessageEmbed()
			.setColor(config.embedColor)
			.setTitle('Purged Messages')
			.setDescription(`${message.user.username} purged ${num} messages in <#${message.channel.id}>`);

		logs.send({ embeds: [embed] });
	},
};
