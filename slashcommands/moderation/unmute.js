const Discord = require('discord.js');
const config = require('../../config.json');
module.exports = {
	name: 'unmute',
	category: 'moderation',
	description: 'Beano brings the user back from the land of the rats',
	usage: `${config.prefix}unmute <user>`,
	options: [
		{
			name: 'user',
			type: 'USER',
			description: 'The user you want to unmute',
			required: true,
		},
	],
	moderation: true,
	run: async (client, interaction) => {
		// command
		if (!message.member.permissions.has('MANAGE_MESSAGES')) {
			return interaction.editReply('You don\'t have permissions for that :/');
		}
		const AC = await client.guilds.fetch(config.AC);
		const logs = await AC.channels.cache.get(config.logs);
		const member = await AC.members.fetch(args[0]);
		if (member.roles.cache.has(config.cafeGuest)) {
			return interaction.editReply('That user isn\'t muted.');
		}
		member.roles.add(message.guild.roles.cache.get(config.cafeGuest));
		const logEmb = new Discord.MessageEmbed()
				.setTitle(`${member.user.username} Muted`)
				.setColor(config.embedColor)
				.addField('Moderator', message.user.toString(), true)
				.footer(`ID | ${member.id}`, member.user.displayAvatarURL());
		logs.send(logEmb);
		return interaction.editReply(`Unmuted ${member.toString()}`);
	},
};