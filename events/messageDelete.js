const Discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'messageDelete',
	async execute(message, client) {
		if (message.guild.id != config.AC) return;
		const AC = await client.guilds.fetch(config.AC);
		const logs = await AC.channels.cache.get(config.logs);
		if (!message.author) return;
		if (message.author.bot) return;
		const imageDelete = message.attachments.first() ? message.attachments.first().proxyURL : null;

		const embedMessageDelete = new Discord.MessageEmbed()
			.setTitle('Message Deleted')
			.addField('Author', `${message.author} | ${message.author.id}`)
			.addField('Deleted in', `${message.channel}`)
			.addField('Message Content', `${message.content || `[Attachment Link](${imageDelete})`}`)
			.setColor('#f54542')
			.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
			.setImage(imageDelete)
			.setTimestamp();
		logs.send({ embeds: [embedMessageDelete] });
	},
};