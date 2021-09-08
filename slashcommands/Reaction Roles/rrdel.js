const Discord = require('discord.js');
const config = require('../../config.json');
const rrSchema = require('../../models/rrschema.js');
module.exports = {
	name: 'rrdel',
	category: 'Reaction Roles',
	description: 'Deletes a certain reaction role',
	usage: `${config.prefix}rrdel [reaction role ID]`,
	options: [
		{
			name: 'reaction_role_id',
			type: 'INTEGER',
			description: 'The ID of the reaction role you want to delete',
			required: false,
		},
	],
	run: async (client, message, args) => {
		// reaction role
		const numReactionRoles = await rrSchema.countDocuments({});
		if (args[0]) {
			const fields = [];
			if (!message.member.permissions.has('MANAGE_MESSAGES')) {
				return message.editReply('You don\'t have permissions for that :/');
			}
			if (args[0] > numReactionRoles) {
				return message.editReply('That reaction role doesn\'t exist!');
			}
			const reactionRole = await rrSchema.findOne({ id: args[0] });
			await rrSchema.deleteOne({ id: args[0] });
			for (let i = reactionRole.id + 1;i < numReactionRoles + 1; i++) {
				const nextRR = await rrSchema.findOne({ id:i });
				nextRR.id--;
				await nextRR.save();
			}
			message.editReply('Reaction role successfully deleted!');
			const AC = await client.guilds.fetch(config.AC);
			const logs = await AC.channels.cache.get(config.logs);
			const embed = new Discord.MessageEmbed()
				.setColor(config.embedColor)
				.setTitle('Reaction Role Deleted')
				.setTimestamp()
				.setDescription('Reaction role was cleared by user ' + message.user.tag);
			return logs.send({ embeds: [embed] });
		}
		else {
			if (!message.member.permissions.has('MANAGE_MESSAGES')) {
				return message.editReply('You don\'t have permissions for that :/');
			}
			await rrSchema.deleteMany({});
			message.editReply('Reaction roles successfully cleared!');
			const AC = await client.guilds.fetch(config.AC);
			const logs = await AC.channels.cache.get(config.logs);
			const embed = new Discord.MessageEmbed()
				.setColor(config.embedColor)
				.setTitle('Reaction Roles Cleared')
				.setTimestamp()
				.setDescription('Reaction roles were cleared by user ' + message.user.tag);
			return logs.send({ embeds: [embed] });
		}
	},
};