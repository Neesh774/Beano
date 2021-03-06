const Discord = require('discord.js');
const config = require('../config.json');
const rrSchema = require('../models/rrschema.js');
const sbSchema = require('../models/starboard.js');
const mSchema = require('../models/memberschema.js');
const sSchema = require('../models/suggestschema.js');
const databaseFuncs = require('../functions/databaseFuncs');
module.exports = {
	name: 'messageReactionAdd',
	async execute(messageReaction, user, client) {
		if (messageReaction.message.guild.id != config.AC) return;
		const message = messageReaction.message;
		const schema = await rrSchema.findOne({ channelID: message.channel.id, messageID: message.id, reactionID: messageReaction.emoji.id ?? messageReaction.emoji.name });
		const AC = await client.guilds.fetch(config.AC);
		// ===============Reaction Roles===============
		if (schema) {
			const member = message.guild.members.cache.get(user.id);
			if (!member.roles.cache.has(schema.roleID)) {
				member.roles.add(schema.roleID);
				member.send({ content: `Gave you the ${message.guild.roles.cache.get(schema.roleID).name} role in ${message.guild.name}!` });
				const logs = await AC.channels.cache.get(config.logs);
				const embed = new Discord.MessageEmbed()
					.setColor(config.embedColor)
					.setTitle('Reaction role used')
					.setDescription(`${user.tag} was given the ${message.guild.roles.cache.get(schema.roleID).name} role.`)
					.setTimestamp()
					.setAuthor(user.tag, user.avatarURL());
				return logs.send({ embeds: [embed] });
			}
		}
		// ==============================Starboard==============================
		if (message.reactions.cache.some(reaction => reaction.emoji.id === config.starboardEmote && reaction.count === config.starboardCount)) {
			const starboardChannel = await AC.channels.cache.get(config.starboardChannel);
			const attachments = message.attachments && message.attachments.first() ? message.attachments.first() : undefined;

			const member = await mSchema.findOne({ userID: message.author.id });
			member.starboards++;
			await member.save();

			const emb = new Discord.MessageEmbed()
				.setAuthor(message.author.username, message.author.avatarURL())
				.addField('Channel', messageReaction.message.channel.toString(), false)
			// eslint-disable-next-line quotes
				.setColor(config.embedColor);
			if (message.content.length > 0) emb.setDescription(message.content.slice(0, 1999));
			emb.addField('Source', `[Jump!](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`);
			if (attachments) emb.setImage(attachments.url);
			starboardChannel.send({ embeds: [emb] }).then(async msg => {
				const count = await sbSchema.countDocuments();
				const sb = new sbSchema({
					messageID: message.id,
					channelID: message.channel.id,
					author: message.author.username,
					authorID: message.author.id,
					authorAvatar: message.author.avatarURL(),
					id: count,
					starboardID: msg.id,
				});
				sb.save();
			});
		}
		// ============================Suggestions==============================
		const suggest = await sSchema.findOne({ messageID: message.id });
		if (suggest && !user.bot) {
			switch (messageReaction.emoji.id) {
			case (config.upvote):
				suggest.upvotes++;
				break;
			case (config.downvote):
				suggest.downvotes++;
				break;
			}
			await suggest.save();
		}
		// ============================EGGGGGG==============================
		if (message.channel.id === config.egg && messageReaction.emoji.name == '???' && message.author.id != user.id) {
			const member = await mSchema.findOne({ userID: message.author.id });
			if (!member) {
				databaseFuncs.createMember(message.author.username, message.author.id);
			}
			member.eggPoints ? member.eggPoints++ : member.eggPoints = 1;
			await member.save();
		}
	},
};