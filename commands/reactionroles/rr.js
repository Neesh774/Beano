const Discord = require("discord.js");
const { ReactionRole } = require("reaction-role");
const config = require("C:/Users/kkanc/Beano/config.json");
const emojis = require("../../emojis.js")
const rrSchema = require('C:/Users/kkanc/Beano/models/rrschema.js');
module.exports = {
    name: "rr",
    category: "utility",
    description: "Creates a reaction role on the given message with the given emote",
    usage: "rr <Channel ID> <Message ID> <Role ID> <Reaction Emote>",
    run: async(client, message, args) => {

        //command
        if (!args[0]) return message.channel.send(`:x: | **Specify The ChannelID or mention The Channel**`);
        if (!args[1]) return message.channel.send(`:x: | **Specify The messageID**`);
        if (!args[2]) return message.channel.send(`:x: | **Specify The roleID or mention The Role**`);
        if (!args[3]) return message.channel.send(`:x: | **Specify The emoji**`);
        try{
            let channel = message.mentions.channels.first() || await message.guild.channels.cache.get(args[0]);
            if (!channel) return message.channel.send(`:x: | **Channel Not Found**`);
            let channelid = channel.id;

            let msg = await channel.messages.fetch(args[1]);
            if (!msg) return message.channel.send(`:x: | **Message Not Found**`);
            let mes = msg.id;

            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
            if (!role) return message.channel.send(`:x: | **Role Not Found**`);
            role = role.id;

            let emoji = await Discord.Util.parseEmoji(args[3]);
            if (!emoji && !emojis.includes(args[3])) return message.channel.send(":x: | **Specify a valid emoji**");
            if (emoji && !emojis.includes(args[3])) {
                let checking = await client.emojis.cache.find(x => x.id === emoji.id);
                if (!checking) return message.channel.send(`:x: | **Invalid Emoji**`);
            };
            const numRRs = await rrSchema.countDocuments({}) + 1;
            const rr = new rrSchema({
                id: numRRs,
                messageID: mes,
                channelID: channelid,
                roleID: role,
                reactionID: emoji.id
            });
            rr.save();
            msg.react(emoji.id)
            let embed = new Discord.MessageEmbed()
                .setTitle("Success!")
                .setDescription("Reaction role spawned successfully")
                .setColor(config.embedColor);
            return message.channel.send(embed);
        }
        catch (e){
            console.log(e.stack);
            let embed = new Discord.MessageEmbed()
                .setTitle("There was an error")
                .setDescription("Please make sure you are using the proper arguments.")
                .setColor(config.embedColor);
            return message.channel.send(embed);
        }
    }
}; 