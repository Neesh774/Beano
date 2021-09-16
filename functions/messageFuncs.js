const config = require('../config.json');
const ccSchema = require('../models/ccschema');
const arSchema = require('../models/arschema');
const hlSchema = require('../models/hlschema');
const ms = require('ms');
const Filter = require('badwords-filter');
const Discord = require('discord.js');
module.exports = {
    sendCustomCommand: async function(message, client) {
		const prefix = config.prefix;
		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const cmd = args.shift().toLowerCase();
		const schema = await ccSchema.findOne({ trigger: cmd });
		if (!schema) {
			return false;
		}
		if (client.ccCoolDowns.has(schema.id)) {
			return message.reply('That auto response is on cooldown!').then(msg => setTimeout(() => msg.delete(), 5000));
		}
		const responses = schema.responsesArray;
		const ranInt = Math.floor(Math.random() * responses.length);
		try {
			client.ccCoolDowns.add(schema.id);
			setTimeout(() => {client.ccCoolDowns.delete(schema.id);}, 5 * 1000);
			return message.reply({ content: responses[ranInt], allowedMentions: { repliedUser: false } });
		}
		catch (e) {
			console.log(e.stack);
		}
	},
    sendAutoResponse: async function(message, client) {
		const schema = await arSchema.findOne({ trigger: message });
		if (!schema) {
			return false;
		}
		if (client.autoResponseCoolDowns.has(schema.id)) {
			return message.reply('That auto response is on cooldown!').then(msg => setTimeout(() => msg.delete(), 5000));
		}
		const responses = schema.responsesArray;
		const ranInt = Math.floor(Math.random() * responses.length);
		try {
			client.autoResponseCoolDowns.add(schema.id);
			setTimeout(() => {client.autoResponseCoolDowns.delete(schema.id);}, 5 * 1000);
			return message.reply({ content: responses[ranInt], allowedMentions: { repliedUser: false } });
		}
		catch (e) {
			console.log(e.stack);
		}
	},
    setReminder: async function(time, reminder, member, interaction) {
		const response = `Okily dokily ${member.user.username}, I'll remind you in ${time} to ${reminder}`;
		interaction.editReply(response);

		// Create reminder time out
		setTimeout(() => {member.user.send('Reminder to ' + reminder);}, ms(time));
	},
    setCoolDown: async function(profile) {
		profile.coolDown = false;
		await profile.save();
	},
	checkHighlight: async function(message, client) {
		const members = await hlSchema.find({ $text: { $search: message.content, $diacriticSensitive: true, $caseSensitive: false } });
		if (members.length > 0) {
			members.forEach(async (schema) => {
				const AC = await client.guilds.fetch(config.AC);
				const member = await AC.members.fetch(schema.userID);
				if (message.author.id == member.id) return;
				if (message.channel.id == schema.ignore) return;
				const embed = new Discord.MessageEmbed()
					.setColor(config.embedColor)
					.setTitle('Highlight Triggered')
					.setDescription(`**${message.author.username}:** ${message.content}`)
					.addField('Jump', `[Jump!](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
					.setTimestamp();
				member.user.send({ embeds: [embed], content: `In ${message.guild.name} ${message.channel.toString()}, you were mentioned with a highlight.` });
			});
		}
	},
};