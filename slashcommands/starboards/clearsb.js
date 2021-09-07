const Discord = require("discord.js")
const sbSchema = require("../../models/starboard.js");
const config = require("../../config.json");

module.exports = {
  name: "clearsb",
  category: "Starboards",
  description: "Clears all of the starboards.",
  usage: `${config.prefix}clearsb`,
  options: [],
  run: async (client, message, args) => {
    if(!message.member.permissions.has("MANAGE_MESSAGES")){
        return message.editReply("You don't have permissions for that :/");
    }
    await sbSchema.deleteMany({});
    return message.editReply("Successfully deleted all of the starboards.");
  }
};