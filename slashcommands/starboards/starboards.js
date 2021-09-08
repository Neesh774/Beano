const Discord = require("discord.js")
const mSchema = require("../../models/memberschema");
const sbSchema = require("../../models/starboard.js");
const config = require("../../config.json");

module.exports = {
  name: "starboards",
  category: "Starboards",
  description: "Tells you how many starboards you have, or how many someone else has",
  usage: `${config.prefix}sbs [user]`,
  options: [
    {
      name: 'user',
      type: 'USER',
      description: 'The user to check the starboards of',
      required: false,
  },
  ],
  run: async (client, message, args) => {
    let member = await mSchema.findOne({userID: message.user.id});
    let user = message.user;
    if(args[0]){
        user = args[0];
        member = await mSchema.findOne({userID: user.id});
    }
    let embed = new Discord.MessageEmbed() 
        .setColor(config.embedColor)
        .setTitle(`${message.user.username}'s starboards`)
        .setAuthor("Beano Starboards", message.user.avatarURL());
    if(member.starboards > 0){
        let fields = [];
        const starboards = await sbSchema.find({authorID: user.id});
        const AC = await client.guilds.fetch(config.AC); 
        for(var i = 0; i < starboards.length; i ++){
            const channel = await AC.channels.cache.get(starboards[i].channelID);
            const msg = await channel.messages.fetch(starboards[i].messageID);
            fields.push({"name": `#${i +1}`, "value": `[Jump!](${msg.url})`})
        }
        embed.addFields(fields);
    }
    return message.editReply({embeds: [embed]});
  }
};