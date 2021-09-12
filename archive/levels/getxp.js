const Discord = require('discord.js');
const config = require('../../config.json');
const lSchema = require('../../models/levelroleschema.js');
const functions = require('../../functions.js');

module.exports = {
	name: 'getxp',
	category: 'levels',
	description: 'Beano tells you the range of a certain level',
	usage: `${config.prefix}getxp <level>`,
	options: [
		{
			name: 'level',
			type: 'INTEGER',
			description: 'The level you want information about',
			required: true,
		},
	],
	run: async (client, interaction) => {
		// command
		try{
			const level = parseInt(args[0]);
			const xp = await functions.getXP(level);
			const xpNext = await functions.getXP(level + 1);
			return message.editReply(`The range of level ${args[0]} is ${xp}-${xpNext}`);
		}
		catch(e) {
			console.log(e.stack);
			return message.editReply({ content: ':x: There was an error. Please make sure you\'re using the proper arguments and try again.' });
		}
	},
};