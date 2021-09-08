const Discord = require('discord.js');
const config = require('../../config.json');
module.exports = {
    name: 'say',
    category: 'utility',
    description: 'Beano will repeat you.',
    usage: `${config.prefix}say <text>`,
    options: [
        {
            name: 'text',
            type: 'STRING',
            description: 'The text Beano should say',
            required: true,
        },
    ],
    ephemeral: true,
    run: async (client, message, args) => {
    // command
        if(!message.member.permissions.has('MANAGE_MESSAGES')){
            return message.editReply('You don\'t have permissions for that.');
        }
        if(!args[0]){
            return message.editReply('You need to give me something to say!');
        }
        message.editReply({ content: `Successfully said ${args[0]}`, ephemeral: true }).then(msg =>{
            return message.channel.send({ content: args[0] });
        })
    },
};