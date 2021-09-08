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
          name: 'message_id',
          type: 'STRING',
          description: 'The message id of the starboard message',
          required: true,
        },
  ],
  run: async (client, message, args) => {
    if(!message.member.permissions.has("MANAGE_MESSAGES")){
        return message.editReply("You don't have permissions for that :/");
    }
    const msg = await sbSchema.findOne({starboardID: args[0]});
    if(!msg){
        return message.editReply("Sorry, I don't think that message is a starboard");
    }
    await sbSchema.deleteOne({starboardID: args[0]}).catch((e) => {return message.editReply("There was an error. Please try that again.")});
    const AC = await client.guilds.fetch(config.AC);
    const sbChannel = await AC.channels.cache.get(config.starboardChannel);

    const sMessage = await sbChannel.messages.fetch(args[0]);
    await sMessage.delete()
    return message.editReply("Successfully deleted that starboard.");
  }
};