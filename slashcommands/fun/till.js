const config = require('../../config.json');

module.exports = {
    name: "till",
    category: "fun",
    description: "Tells you how many users are needed until the number you enter",
    usage: `${config.prefix}till <number>`,
    options: [
        {
            name: "number_of_users",
            type: "INTEGER",
            description: "The number of users you wnat info about",
            required: true,
        }
    ],
    run: async (client, message, args) => {
        if(!args[0] || isNaN(args[0]) || args[0] < 1) return message.editReply("Please enter a valid number.");
        let num = args[0];
        if(num < message.guild.memberCount){
            return message.editReply(`We already have ${num} users in this server!`);
        }
        message.editReply(`${message.guild.name} needs ${num - message.guild.memberCount} members before getting to ${num} members.`);
    }
}