const Discord = require("discord.js")
const sbSchema = require("../../models/starboard.js");
const config = require("../../config.json");

module.exports = {
  name: "delsb",
  category: "Starboards",
  description: "Deletes a starboard",
  usage: `${config.prefix}delsb <id>`,
  run: async (client, message, args) => {
    if(!message.member.permissions.has("MANAGE_MESSAGES")){
        return message.reply("You don't have permissions for that :/");
    }
    if(!args[1]){
        return message.reply("You didn't tell me which channel I should be looking in!");
    }
    const msg = await sbSchema.findOne({id: args[0]});
    if(!msg){
        return message.reply("Sorry, I don't think that message is a starboard");
    }
    await sbSchema.deleteOne({id: args[0]}).catch((e) => {return message.reply("There was an error. Please try that again.")});
    return message.reply("Successfully deleted that starboard.");
  }
};