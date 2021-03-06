const Discord = require('discord.js');
const config = require('../../config.json');
const mSchema = require('../../models/memberschema.js');
module.exports = {
    name: 'mutexpuser',
    category: 'levels',
    description: 'Beano will ignore a certain user when counting xp',
    usage: `${config.prefix}mutexpuser <user>`,
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user you want to mute xp for',
            required: true,
        },
    ],
    run: async (client, interaction) => {
        // command
        if(!message.member.permissions.has('MANAGE_MESSAGES')){
            return message.editReply('You don\'t have permissions for that :/');
        }
        const user = args[0];

        const member = await mSchema.findOne({ userID: user.id });
        console.log(member);
        if(member.muted){
            member.muted = false;
            await member.save();
            return message.editReply(`XP unmuted user ${member.name}`);
        }
        member.muted = true;
        await member.save();
        return message.editReply(`XP muted user ${member.name}`);
    },
};