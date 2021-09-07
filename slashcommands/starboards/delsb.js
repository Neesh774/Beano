const Discord = require("discord.js")
const sbSchema = require("../../models/starboard.js");
const config = require("../../config.json");

module.exports = {
  name: "delsb",
  category: "Starboards",
  description: "Deletes a starboard",
  usage: `${config.prefix}delsb <id>`,
  options: [
        {
          name: 'id',
          type: 'INTEGER',
          description: 'The id of the starboard',
          required: true,
        },
  ],
  run: async (client, message, args) => {
    if(!message.member.permissions.has("MANAGE_MESSAGES")){
        return message.editReply("You don't have permissions for that :/");
    }
    if(!args[1]){
        return message.editReply("You didn't tell me which channel I should be looking in!");
    }
    const msg = await sbSchema.findOne({id: args[0]});
    if(!msg){
        return message.editReply("Sorry, I don't think that message is a starboard");
    }
    await sbSchema.deleteOne({id: args[0]}).catch((e) => {return message.editReply("There was an error. Please try that again.")});
    return message.editReply("Successfully deleted that starboard.");
  }
};