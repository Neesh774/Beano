const Discord = require("discord.js");
const config = require("C:/Users/kkanc/Beano/config.json");
const mSchema = require('C:/Users/kkanc/Beano/models/memberschema.js');
module.exports = {
    name: "llb",
    category: "levels",
    description: "Beano will get you a leaderboard of all of the levels",
    usage: "llb",
    run: async (client, message, args) => {
    //command
        let list = await mSchema.find({});
        list.sort(function(a,b){
            return b.xp - a.xp;
        });
        let fields = [];
        for(var i = 0;i < 10; i ++){
            fields.push({"name":`#${i+1}: ${list[i].name}`, "value":`Level: ${list[i].level+1}, XP: ${list[i].xp}`})
        }
        let embed = new Discord.MessageEmbed()
            .setColor(config.embedColor)
            .setTitle("Leaderboard")
            .setDescription("Here's the leaderboard for Arcade Cafe!")
            .addFields(fields);
        return message.channel.send(embed);
    }
};