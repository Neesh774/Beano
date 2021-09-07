const config = require('../../config.json');

module.exports = {
    name: 'invite',
    category: 'info',
    description: 'Gives you the invite link to the server you\'re in',
    usage: `${config.prefix}invite`,
    options: [],
    run: async (client, message, args) => {
        return message.editReply(`Here's your invite link to Arcade Cafe! \n${config.invite}`);
    },
}
