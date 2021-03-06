const Discord = require('discord.js');
const config = require('../../config.json');
const sSchema = require('../../models/suggestschema');

module.exports = {
	name: 'suggestions',
	category: 'suggestions',
	description: 'Lists all suggestions',
	usage: `${config.prefix}suggestions`,
	options: [],
	run: async (client, interaction) => {
		// command
		const fields = [];
		const numSuggest = await sSchema.countDocuments({});
		for (let i = 1;i < numSuggest + 1;i++) {
			const suggest = await sSchema.findOne({ id: i }).exec();
			fields.push({ 'name': `#${i} ${suggest.createdBy} | ${suggest.status}`, 'value': `${suggest.suggestion} | 👍 ${suggest.upvotes} 👎 ${suggest.downvotes}` });
		}
		const embed = new Discord.MessageEmbed()
			.setColor(config.embedColor)
			.setTitle('Suggestions for ' + interaction.guild.name)
			.addFields(fields);
		return interaction.editReply({ embeds: [embed] });
	},
};