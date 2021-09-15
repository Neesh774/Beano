const config = require('../../config.json');
const Discord = require('discord.js');
module.exports = {
    name: 'lock',
    category: 'moderation',
    description: 'Locks the current channel and prevents anyone from sending messages',
    usage: `${config.prefix}lock`,
    options: [],
	moderation: true,
    run: async (client, interaction) => {
        if (!interaction.channel.permissionsFor(interaction.member).has('BAN_MEMBERS')) return interaction.editReply('You don\'t have permissions for that :/');
        if (client.lockedChannels.has(interaction.channel.id)) {
            interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SEND_MESSAGES: true,
            },
            {
                reason: `Unlock by ${interaction.user.username}`,
            });
            client.lockedChannels.delete(interaction.channel.id);
            console.log(client.lockedChannels);
            const lockEmbed = new Discord.MessageEmbed()
                .setDescription(`Successfully unlocked ${interaction.channel.name}`)
                .setColor(config.embedColor);
            return interaction.editReply({ embeds: [lockEmbed] });
        }
        else {
            interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SEND_MESSAGES: false,
            },
            {
                reason: `Lock by ${interaction.user.username}`,
            });
            client.lockedChannels.add(interaction.channel.id);
            console.log(client.lockedChannels);
            const unlockEmbed = new Discord.MessageEmbed()
                .setDescription(`Successfully locked ${interaction.channel.name}`)
                .setColor(config.embedColor);
            return interaction.editReply({ embeds: [unlockEmbed] });
        }
    },
};