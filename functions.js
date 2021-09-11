const config = require('./config.json');
const token = require('./token.json');
const Discord = require('discord.js');
const ms = require('ms');
const mSchema = require('./models/memberschema.js');
const mcSchema = require('./models/mchannelschema.js');
const lrSchema = require('./models/levelroleschema.js');
const rrSchema = require('./models/rrschema');
const sSchema = require('./models/suggestschema');
const sbSchema = require('./models/starboard');
module.exports = {
	// getXP: async function(level) {
	// 	return Math.floor(50 * level);
	// },
	// getLevel: async function(xp) {
	// 	return Math.floor(xp / 50);
	// },
	// levelUser: async function(message, client) {
	// 	const mc = await mcSchema.findOne({ channel: message.channel.id });
	// 	const og = await mSchema.exists({ userID: message.author.id });
	// 	if (message.author.bot || mc) {
	// 		return;
	// 	}
	// 	if (!og) {
	// 		const mS = new mSchema({
	// 			name: message.author.username,
	// 			userID: message.author.id,
	// 			level: 1,
	// 			xp: 0,
	// 			muted: false,
	// 			starboards: 0,
	// 		});
	// 		await mS.save();
	// 	}
	// 	const profile = await mSchema.findOne({ userID: message.author.id });
	// 	if (profile.muted) {
	// 		return;
	// 	}
	// 	if (!client.coolDowns.has(profile.userID)) {
	// 		const ranXP = Math.floor((Math.random() * 5) + 1);
	// 		const nextLevelXP = await this.getXP(profile.level + 1);
	// 		// const currentLevelXP = await this.getXP(profile.level);
	// 		const nextLevel = profile.level + 1;
	// 		// const levelXP = profile.xp - currentLevelXP;
	// 		profile.xp += ranXP;
	// 		await profile.save();
	// 		if (ranXP + profile.xp > nextLevelXP) {
	// 			profile.level++;
	// 			const lr = await lrSchema.findOne({ level: nextLevel });
	// 			const embed = new Discord.MessageEmbed()
	// 				.setColor(config.embedColor)
	// 				.setTitle('CONGRATS!')
	// 				.setDescription(`${message.author.toString()} just leveled up to level ${nextLevel}!`)
	// 				.setImage('https://octoperf.com/img/blog/minor-version-major-features/level-up.gif');
	// 			if (lr) {
	// 				await message.member.roles.add(lr.roleID);
	// 				const guild = await client.guilds.fetch(config.AC);
	// 				const role = await guild.roles.fetch(lr.roleID);
	// 				const lrPing = role.toString();
	// 				embed.addField('Awarded Roles', lrPing);
	// 				message.channel.send({ embeds: [embed] });
	// 			}
	// 		}
	// 		await profile.save();
	// 		client.coolDowns.add(profile.userID);
	// 		setTimeout(() => {client.coolDowns.delete(profile.userID);}, 60 * 1000);
	// 	}
	// },
        createMember: async function(username, id) {
            const mS = new mSchema({
                name: username,
                userID: id,
                level: 1,
                xp: 0,
                muted: false,
                starboards: 0,
                numberWarns: 0,
                warnReasons: [],
            });
            await mS.save();
        },
};