const Discord = require("discord.js")
const config = require("C:/Users/kkanc/Beano/config.json");
const sSchema = require("C:/Users/kkanc/Beano/models/suggestschema.js");
module.exports = {
    name: "suggestdel",
    category: "Custom Commands and Auto Reponses",
    description: "Deletes a certain suggestion",
    usage: "suggestdel [suggestion ID]",
    run: async (client, message, args) => {
    //command
    const numSuggests = await sSchema.countDocuments({});
    let fields = [];
        if(!message.member.hasPermission("MANAGE_MESSAGES")){
            return message.reply("You don't have permissions for that :/");
        }
        if(args[0] > numSuggests){
            return message.reply("That command doesn't exist!");
        }
        const suggest = await sSchema.findOne({id: args[0]});
        await sSchema.deleteOne({id: args[0]});
        for(var i = suggest.id + 1;i < numSuggests + 1; i ++){
            const nextSuggest = await sSchema.findOne({id:i});
            nextSuggest.id --;
            await nextSuggest.save();
        }
        message.reply(`Suggestion with content ${suggest.suggestion} successfully deleted!`);
        const AC = await client.guilds.fetch("833805662147837982"); 
        const logs = await AC.channels.cache.get("848592231391559710");
        let embed = new Discord.MessageEmbed()
            .setColor(config.embedColor)
            .setTitle("Suggestion Deleted")
            .setTimestamp()
            .setDescription(`Suggestion with content ${suggest.suggestion} was cleared by user ` + message.author.tag);
        return logs.send(embed);
    }
};