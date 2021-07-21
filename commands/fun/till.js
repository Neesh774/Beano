const config = require('../../config.json');

module.exports = {
    name: "till",
    category: "fun",
    description: "Tells you how many users are needed until the number you enter",
    usage: `${config.prefix}till <number>`,
    run: async (client, message, args) => {
        if(!args[0] || isNaN(args[0]) || args[0] < 1) return message.channel.send("Please enter a valid number.");
        let num = args[0];
        if(num < message.guild.memberCount){
            return message.channel.send(`We already have ${num} users in this server!`);
        }
        message.channel.send(`${message.guild.name} needs ${num - message.guild.memberCount} members before getting to ${num} members.`);
    }
}