const Discord = require('discord.js');
const config = require('../../config.json');
const mSchema = require('../../models/memberschema');
const databaseFuncs = require('../../functions/databaseFuncs');
module.exports = {
	name: 'eggs',
	category: 'EmojiGuessingGame',
	description: 'Tells you how many egg points you have!',
	usage: `${config.prefix}eggs`,
	run: async (client, interaction) => {
        const member = await mSchema.findOne({
            userID: interaction.user.id,
        });
        if (!member) {
            databaseFuncs.createMember(interaction.user.username, interaction.user.id);
            interaction.editReply(`${interaction.user.username} doesn't have any egg points D:`);
        }
        else {
            const embed = new Discord.MessageEmbed()
                .setColor(config.embedColor)
                .setDescription(`${interaction.user.toString()} has ${member.eggPoints} egg points!`);
            interaction.editReply({ embeds: [embed] });
        }
	},
};