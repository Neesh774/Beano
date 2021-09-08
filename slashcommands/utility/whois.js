const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
	name: 'userinfo',
	category: 'utility',
	description: 'Get information about a user',
	usage: `${config.prefix}userinfo [user]`,
	options: [
		{
			name: 'user',
			type: 'USER',
			description: 'The user you want info about',
			required: false,
		},
	],
	run: async (client, message, args) => {
		const AC = await client.guilds.fetch(config.AC);
		let user = await AC.members.fetch(args[0]);
		user = user.user;
		if (!args[0]) {
			user = message.user;
		}
		const person = new Discord.MessageEmbed()
			.setTitle('User Info:')
			.addField('Full Username', `${user.tag}`)
			.addField('ID', user.id)
			.addField('Joined Discord At', user.createdAt.toString())
			.setColor(config.embedColor)
			.setTimestamp()
			.setThumbnail(user.avatarURL());
		message.editReply({ embeds: [person] });
	},
};