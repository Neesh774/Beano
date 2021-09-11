const Discord = require('discord.js');
const config = require('../../config.json');
const mSchema = require('../../models/memberschema');
const databaseFuncs = require('../../functions/databaseFuncs');
const memberschema = require('../../models/memberschema');
module.exports = {
	name: 'removewarn',
	category: 'moderation',
	description: 'Beano removes a warn from a user.',
	usage: `${config.prefix}removewarn <user> [reason]`,
	options: [
		{
			name: 'user',
			type: 'USER',
			description: 'The user you want to remove a warn from',
			required: true,
		},
		{
			name: 'reason',
			type: 'STRING',
			description: 'The reason you want to take the warn away',
			required: false,
		},
	],
	moderation: true,
	run: async (client, message, args) => {
		// command
		const AC = await client.guilds.fetch(config.AC);
        const member = await AC.members.fetch(args[0]);
		const memberSchema = await mSchema.findOne({ userID: member.id });
		if (!memberSchema) {
			databaseFuncs.createMember(member.user.username, member.id);
			return message.editReply('That user doesn\'t have any warns!');
		}
		else if (memberSchema.numberWarns == 0) {
			return message.editReply('That user doesn\'t have any warns!');
		}
		const reason = args[1] ? args[1] : 'No reason given';
		memberSchema.numberWarns--;
		await memberSchema.save();
		const embed = new Discord.MessageEmbed()
			.setColor(config.embedColor)
			.setTitle('Warn Removed ')
			.setDescription(`A warn has been removed from ${member.user.username}`)
			.addField('Reason', reason)
			.addField('Warns', `${memberSchema.numberWarns}`)
			.addField('Removed by', message.user.toString())
			.setFooter(`${member.user.username} | ${member.id}`, member.user.displayAvatarURL())
			.setTimestamp();
		const logs = await AC.channels.cache.get(config.logs);
		logs.send({ embeds: [embed] });
		return message.editReply(`Successfully removed a warn from ${member.user.username}. They now have ${memberSchema.numberWarns} warns.`);
	},
};