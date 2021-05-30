const Discord = require("discord.js");
const config = require("C:/Users/kkanc/Beano/config.json");
module.exports = {
    name: "say",
    category: "utility",
    description: "Beano will repeat you.",
    usage: "[command]",
    run: async (client, message, args) => {
    //command
        if(!message.member.hasPermission("MANAGE_MESSAGES")){
            return message.reply("You don't have permissions for that.");
        }
        if(!args[0]){
            return message.reply("You need to give me something to say!");
        }
        message.delete().then(msg =>{
            return msg.channel.send(args.join(" "));
        })
    }
};