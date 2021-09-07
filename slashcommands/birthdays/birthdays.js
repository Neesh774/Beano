const Discord = require("discord.js");
const config = require("../../config.json");
const bSchema = require('../../models/bday.js');
const functions = require('../../functions.js');

module.exports = {
    name: "birthdays",
    category: "birthdays",
    description: "Beano tells you how old everyone is :)",
    usage: `${config.prefix}birthdays [page]`,
    options: [{
      name: 'page',
      type: 'INTEGER',
      description: 'The page of birthdays you want to see',
      required: false,
    }],
    run: async (client, message, args) => {
    //command
    let list = await bSchema.find({});
    let numPages = Math.ceil(list.length / 10);
    const AC = await client.guilds.fetch(config.AC); 
    let fields = [];
    let start = 0;
    let end = 10;
    let page = 1;
    if(list.length < 10){
        end = list.length;
    }
    let numEntries = 10;
    let arg = 1;
    if(args[0]){
      arg = args[0];
    }
    if(args[0] > numPages || args[0] < 0){
      return message.editReply("We don't seem to have that many users with birthdays yet.");
    }
    if(arg == numPages){
      numEntries = list.length - 10*(numPages - 1);  
    }
    start = 10 * (arg - 1);
    end = numEntries + start;
    page = arg;
    for(var i = start; i < end; i ++){
      fields.push({"name": `#${i+1} | ${list[i].user}`, "value": `${list[i].birthday.toString().slice(4, 10)}`})
    }
    let embed = new Discord.MessageEmbed()
      .setColor(config.embedColor)
      .setTitle(`Birthdays [${page}/${numPages}]`)
      .addFields(fields)
      .setAuthor("Beano Birthdays", AC.iconURL());
    return message.editReply({embeds: [embed]});
    }
};