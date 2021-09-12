const Discord = require('discord.js');
const config = require('../config.json');
const badwords = require('../nonowords.json');
module.exports = {
	name: 'messageUpdate',
	async execute(oldMessage, newMessage, client) {
		if (newMessage.guild.id != config.AC) return;
		for (let i = 0;i < badwords.badwords.length;i++) {
			if (newMessage.content.toLowerCase().includes(badwords.badwords[i].toLowerCase())) {
				newMessage.delete().then(msg => {
					functions.warn(newMessage.member, newMessage.guild, newMessage.channel, 'no no word', client);
					msg.channel.send({ content: 'SMH MY HEAD NO NO WORD' });
				});
			}
		}
		const AC = await client.guilds.fetch(config.AC);
		const logs = await AC.channels.cache.get(config.logs);

		if (newMessage.partial) return;
		if (newMessage.author.bot) return;
		if (oldMessage.content == newMessage.content) return;

		const embedMessageUpdate = new Discord.MessageEmbed()
			.setTitle('Message Edited')
			.setColor('#f5c842')
			.addField('Author', `${oldMessage.author.toString()} | ${oldMessage.author.id}`)
			.addField('Edited in', `${newMessage.channel.toString()} | ${newMessage.channel.id}`)
			.addField('Jump!', `[Click here](${newMessage.url})`)
			.addField('Old', `${oldMessage.content}`)
			.addField('New', `${newMessage.content}`)
			.setThumbnail(newMessage.author.displayAvatarURL({ dynamic: true }));
		logs.send({ embeds: [embedMessageUpdate] });
	},
};