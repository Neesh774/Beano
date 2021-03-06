const Discord = require('discord.js');
const config = require('../../config.json');
const mSchema = require('../../models/memberschema.js');
module.exports = {
	name: 'llb',
	category: 'levels',
	description: 'Beano will get you a leaderboard of all of the levels',
	usage: `${config.prefix}llb`,
	options: [],
	run: async (client, interaction) => {
		// command
		const list = await mSchema.find({});
		list.sort(function(a, b) {
			return b.xp - a.xp;
		});
		const fields = [];
		let num = 10;
		if(list.length < 10) num = list.length;
		for(var i = 0;i < num; i++) {
			fields.push({ 'name':`#${i + 1}: ${list[i].name}`, 'value':`Level: ${list[i].level}, XP: ${list[i].xp}` });
		}
		const embed = new Discord.MessageEmbed()
			.setColor(config.embedColor)
			.setTitle(`Leaderboard for ${message.guild.name}`)
			.addFields(fields);
		return message.editReply({ embeds: [embed] });
	},
};