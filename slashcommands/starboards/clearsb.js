const Discord = require('discord.js');
const sbSchema = require('../../models/starboard.js');
const config = require('../../config.json');

module.exports = {
	name: 'clearsb',
	category: 'Starboards',
	description: 'Clears all of the starboards.',
	usage: `${config.prefix}clearsb`,
	options: [],
	moderation: true,
	run: async (client, interaction) => {
		if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
			return interaction.editReply('You don\'t have permissions for that :/');
		}
		await sbSchema.deleteMany({});
		return interaction.editReply('Successfully deleted all of the starboards.');
	},
};