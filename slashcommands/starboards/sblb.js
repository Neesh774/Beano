const Discord = require("discord.js")
const mSchema = require("../../models/memberschema");
const config = require("../../config.json");

module.exports = {
  name: "sblb",
  category: "Starboards",
  description: "Gives you a list of who has the most starboards",
  usage: `${config.prefix}sblb [page]`,
  options: [
    {
      name: 'page',
      type: 'INTEGER',
      description: 'The page of the starboard leaderboard to check',
      required: false,
  },
  ],
  run: async (client, message, args) => {
    //ordering list
    let list = await mSchema.find({});
    if(!list[0]) return message.editReply("Looks like we don't have any starboards yet :/");
    list.sort(function(a,b){
        return b.starboards - a.starboards;
    });
    list = list.filter(member => member.starboards > 0);
    //variables
    let numPages = Math.ceil(list.length / 10);
    const AC = await client.guilds.fetch(config.AC); 
    let fields = [];
    let start = 0;
    let end = list.length < 10? list.length : 10;
    let page = args[0]? args[0] : 1;
    //logic
    if(args[0] > numPages || args[0] < 0) return message.editReply("We don't seem to have that many users with starboards yet.");
    if(args[0] == numPages){
      numEntries = list.length - 10*(numPages - 1);  
    }
    start = 10 * (page - 1);
    for(var i = start; i < end; i ++){
      fields.push({"name": `#${i+1} | ${list[i].name}`, "value": `${list[i].starboards} starboards`})
    }
    let embed = new Discord.MessageEmbed()
      .setColor(config.embedColor)
      .setTitle(`Starboards [${page}/${numPages}]`)
      .addFields(fields)
      .setAuthor("TerraBot Starboard Leaderboard", AC.iconURL());
    return message.editReply({embeds: [embed]});
  }
};