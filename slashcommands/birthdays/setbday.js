const Discord = require("discord.js");
const config = require("../../config.json");
const bSchema = require('../../models/bday.js');
const functions = require('../../functions.js');

module.exports = {
    name: "setbday",
    category: "birthdays",
    description: "Beano sets your birthday!",
    usage: `${config.prefix}setbday <mm> <dd>`,
    options: [{
        name: 'month',
        type: 'INTEGER',
        description: 'The month of your birthday, must be between 0 and 12.',
        required: true,
    },
    {
        name: 'day',
        type: 'INTEGER',
        description: 'The day of your birthday, must be between 0 and 31.',
        required: true,
    }],
    run: async (client, message, args) => {
    //command
    
        if(args.length != 2){
            return message.editReply("Please send me your birthday in the format `<mm> <dd>`(with spaces in between)!");
        }
        const month = parseInt(args[0]);
        const day = parseInt(args[1]);
        if((!month || !day) || month < 0 || month > 12 || day > 31 || day < 1){
            return message.editReply("Please send me your birthday in the format `<mm> <dd>`(with spaces in between)!");
        }
        const hasbday = await bSchema.findOne({userID: message.user.id});
        if(hasbday){
            await hasbday.remove();
        }
        let datestring = `${month} ${day}`;
        let bday = new bSchema({
            user: message.user.username,
            userID: message.user.id,
            birthday: new Date(datestring)
        });
        await bday.save();
        let embed = new Discord.MessageEmbed()
            .setColor(config.embedColor)
            .setTitle("Birthday set successfully")
            .setDescription(`I set your birthday to ${new Date(datestring).toString().slice(4, 10)}`);
        return message.editReply({embeds: [embed]});
    }
};