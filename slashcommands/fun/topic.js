const Discord = require('discord.js');
const config = require('../../config.json');
const topics = require('../../topics.json');
module.exports = {
	name: 'topic',
	category: 'fun',
	description: 'Will give you a conversation starter.',
	usage: `${config.prefix}topic`,
	options: [],
	run: async (client, interaction) => {
		const index = Math.floor(Math.random() * 170 + 1);
		const topic = topics.All_Topics[index].Table_Topic;
		const embed = new Discord.MessageEmbed()
			.setColor(config.embedColor)
			.setDescription(topic);
		return interaction.editReply({ embeds: [embed] });
	},
};
