const Discord = require('discord.js');
const config = require('C:/Users/kkanc/Beano/config.json');
const rrSchema = require('C:/Users/kkanc/Beano/models/rrschema.js');

module.exports = {
    name: 'messageReactionRemove',
    async execute(messageReaction, user, client){
        const message = messageReaction.message;
        const schema = await rrSchema.findOne({channelID: message.channel.id, messageID: message.id, reactionID: messageReaction.emoji.id})
        if(schema){
            const member = message.guild.members.cache.get(user.id);
            if(member.roles.cache.has(schema.roleID)){
            member.roles.remove(schema.roleID);
            member.send(`Removed your ${message.guild.roles.cache.get(schema.roleID).name} role in Arcade Cafe!`);
            const AC = await client.guilds.fetch("833805662147837982"); 
            const logs = await AC.channels.cache.get("848592231391559710");
            const embed = new Discord.MessageEmbed()
                .setColor(config.embedColor)
                .setTitle("Reaction role removed")
                .setDescription(`${user.tag} was removed from the ${message.guild.roles.cache.get(schema.roleID).name} role.`)
                .setTimestamp()
                .setAuthor(user.tag, user.avatarURL());
            return logs.send(embed);
        }
    }
    }
}