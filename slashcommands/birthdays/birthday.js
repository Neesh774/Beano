const Discord = require('discord.js');
const config = require('../../config.json');
const mSchema = require('../../models/memberschema.js');
const functions = require('../../functions.js');

module.exports = {
    name: 'birthday',
    category: 'birthdays',
    description: 'Beano tells you when your birthday is. It\'s ok, we can all forget sometimes.',
    usage: `${config.prefix}birthday`,
    options: [],
    run: async (client, message, args) => {
    // command
        const hasbday = await mSchema.findOne({ userID: message.user.id, birthday: { $exists: true } });
        if (!hasbday) {
            return message.editReply('You don\'t have a birthday! Set one using the `setbday <mm> <dd>` command!');
        }
        const formattedDate = hasbday.birthday.toString().slice(4, 10);
        const embed = new Discord.MessageEmbed()
            .setColor(config.embedColor)
            .setDescription(`Your birthday is set to ${formattedDate}`);
        return message.editReply({ embeds: [embed] });
    },
};