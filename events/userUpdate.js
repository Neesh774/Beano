const Discord = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'userUpdate',
    async execute(oldUser, newUser, client){
        const AC = await client.guilds.fetch(config.AC);
        const logs = await AC.channels.cache.get(config.logs);
        const member = await AC.members.fetch(newUser.id);
        let updated = false;
        let embed = false;
        if(oldUser.avatar != newUser.avatar){
            embed = new Discord.MessageEmbed()
                .setColor(config.embedColor)
                .setDescription(`**Profile Picture changed of ${newUser.toString()}**`)
                .setColor(config.embedColor)
                .setFooter(`ID: ${newUser.id}`)
                .setAuthor(AC.name, AC.iconURL())
                .addFields(
                    { name: 'Old:', value: `[Link](${oldUser.avatarURL()})`, inline: true },
                    { name: 'New:', value: `[Link](${newUser.avatarURL()})`, inline: true },
                )
                .setTimestamp();
        }
        if (oldUser.username !== newUser.username) {
            embed = new Discord.MessageEmbed()
                .setColor(config.embedColor)
                .setDescription(`**Username changed of ${newUser.toString()}**`)
                .setColor(config.embedColor)
                .setFooter(`ID: ${newUser.id}`)
                .setAuthor(member.guild.name, member.guild.iconURL())
                .addFields(
                    { name: 'Old:', value: `${oldUser.name}`, inline: true },
                    { name: 'New:', value: `${newUser.name}`, inline: true },
                )
                .setTimestamp();
            updated = true;
        }
        if(updated){
            return logs.send({ embeds: [embed] });
        }
    },
}