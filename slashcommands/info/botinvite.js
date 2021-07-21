const config = require('../../config.json');

module.exports = {
    name: 'botinvite',
    category: 'info',
    description: 'Gives you the invite link for Beano',
    usage: `${config.prefix}invite`,
    options: [],
    run: async (client, message, args) => {
        return message.channel.send(`Here's your invite link to Arcade Cafe! \n${config.botinvite}`);
    },
}
