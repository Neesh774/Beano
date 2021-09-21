const config = require('../config.json');
const ccSchema = require('../models/ccschema');
const arSchema = require('../models/arschema');
const hlSchema = require('../models/hlschema');
const mSchema = require('../models/memberschema');
const ms = require('ms');
const Filter = require('badwords-filter');
const Discord = require('discord.js');
const { Client, Intents, Permissions, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const tSchema = require('../models/ticket');
const rSchema = require('../models/reminder');
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
		const numReminders = await rSchema.countDocuments();
		const msTime = parseFloat(new Date().valueOf()) + parseFloat(ms(time));
		const reminderSchema = new rSchema({
			id: numReminders + 1,
			reminder: reminder,
			date: msTime,
			memberId: member.id,
		});
		await reminderSchema.save();
		// Create reminder time out
		setTimeout(async () => {
			member.send(`You asked me to remind you to \`${reminder}\``);
			await reminderSchema.delete();
		}, ms(time));
	},
    setCoolDown: async function(profile) {
		profile.coolDown = false;
		await profile.save();
	},
	checkHighlight: async function(message, client) {
		let members = await hlSchema.find({ $text: { $search: message.content, $diacriticSensitive: true, $caseSensitive: false } });
		members = members.filter((obj, pos, arr) => {
			return arr.map(mapObj => mapObj.phrase).indexOf(obj.phrase) === pos;
		});
		if (members.length > 0) {
			members.forEach(async (schema) => {
				const AC = await client.guilds.fetch(config.AC);
				const member = await AC.members.fetch(schema.userID);
				if (message.author.id == member.id) return;
				if (schema.ignore.contains(message.channel.id)) return;
				const embed = new Discord.MessageEmbed()
					.setColor(config.embedColor)
					.setTitle(`Highlight Triggered - ${schema.phrase}`)
					.setDescription(`**${message.author.username}:** ${message.content}`)
					.addField('Jump', `[Jump!](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
					.setTimestamp();
				member.user.send({ embeds: [embed], content: `In ${message.guild.name} ${message.channel.toString()}, you were mentioned with a highlight.` });
			});
		}
	},
	createTicket: async function(member, client, interaction) {
		const AC = await client.guilds.fetch(config.AC);
		const ticketChannel = await AC.channels.create(`ticket-${member.user.username}`, {
			type: 'GUILD_TEXT',
			topic: `Ticket for ${member.user.username} | ${member.id}`,
			parent: config.tickets,
			permissionOverwrites: [
				{ id: AC.roles.everyone, deny: [Permissions.FLAGS.VIEW_CHANNEL] },
				{ id: await AC.roles.fetch(config.cafeStaff), allow: [
					Permissions.FLAGS.VIEW_CHANNEL,
					Permissions.FLAGS.SEND_MESSAGES,
					Permissions.FLAGS.ATTACH_FILES,
					Permissions.FLAGS.EMBED_LINKS,
					Permissions.FLAGS.READ_MESSAGE_HISTORY,
				] },
				{ id: member, allow: [
					Permissions.FLAGS.VIEW_CHANNEL,
					Permissions.FLAGS.SEND_MESSAGES,
					Permissions.FLAGS.ATTACH_FILES,
					Permissions.FLAGS.EMBED_LINKS,
					Permissions.FLAGS.READ_MESSAGE_HISTORY,
				] },
			],
		});
		interaction.reply({ content: `Here's your ticket! ${ticketChannel.toString()}`, ephemeral: true });
		let roles = '';
		const ignoreRoles = ['834799245969981541', '834673318111477770', '834673457652301824', '834805617502715934', '834807489647607878', '834807489647607878', '833805662147837982'];
		member.roles.cache.each(role => {
			if (!ignoreRoles.includes(role.id)) roles += `${role.toString()}, `;
		});
		const embed = new Discord.MessageEmbed()
			.setColor(config.embedColor)
			.setTitle(`${member.user.username}'s Ticket'`)
			.setDescription(`${member.user.username}'s ticket has been created. Press the button below to close it.`)
			.addField('User', `${member.user.toString()} | ${member.id}`)
			.addField('Roles', roles);
		const button = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId(`ticketdelete ${ticketChannel.id}`)
				.setLabel('Close Ticket')
				.setStyle('DANGER'),
		);
		const message = await ticketChannel.send({ embeds: [embed], content: '<@833805662147837982>', components: [button] });
		const ticketSchema = new tSchema({
			memberID: member.id,
			memberName: member.user.username,
			channelID: ticketChannel.id,
			ticketMessage: message.id,
		});
		await ticketSchema.save();
	},
	deleteTicket: async function(interaction, channelId, client) {
		const AC = await client.guilds.fetch(config.AC);
		const ticket = await tSchema.findOne({ channelID: channelId });
		if (ticket) {
			const ticketChannel = await AC.channels.fetch(ticket.channelID);
			await ticketChannel.delete();
			await ticket.delete();
		}
		interaction.member.send('Your ticket was closed.');
	},
	checkBirthday: async function(client) {
		const members = await mSchema.find({ birthday: { $ne: null } });
		members.forEach(async (member) => {
			const today = new Date();
			const birthday = new Date(member.birthday);
			if (today.getMonth() == birthday.getMonth() && today.getDate() == birthday.getDate()) {
				const AC = await client.guilds.fetch(config.AC);
				const general = await AC.channels.fetch(config.general);
				const dMember = await AC.members.fetch(member.userID);
				const embed = new Discord.MessageEmbed()
				.setColor(config.embedColor)
				.setTitle(`Happy Birthday ${dMember.user.username}!`)
				.setFooter(`${dMember.user.username}`, dMember.user.displayAvatarURL());
				general.send({ embeds:[embed], content: dMember.user.toString() });
			}
		});
		// call checkBirthday after 24 hours
		setTimeout(() => {
			// eslint-disable-next-line no-undef
			checkBirthday(client);
		}, 1000 * 60 * 60 * 24);
	},
	bumper: async function(client, message) {
		if (message.author.id != '302050872383242240') return;
		if (!message.embeds[0] || !message.embeds[0].description) return;
		if (message.embeds[0].description.includes('Bump done')) {
			setTimeout(async () => {
				const embed = new Discord.MessageEmbed()
					.setColor(config.embedColor)
					.setTitle('Bump Ready!')
					.setDescription('This server can be bumped now! Type `!d bump` to bump this server.');
				await message.channel.send({ embeds: [embed] });
			}, 1000 * 60 * 60 * 2);
		}
	},
};