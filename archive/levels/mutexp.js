const Discord = require('discord.js');
const config = require('../../config.json');
const mcSchema = require('../../models/mchannelschema.js');
module.exports = {
    name: 'mutexp',
    category: 'levels',
    description: 'Beano will ignore this channel when counting xp',
    usage: `${config.prefix}mutexp [channel]`,
    options: [
        {
            name: 'channel',
            type: 'CHANNEL',
            description: 'The channel you want to mute xp for',
            required: false,
        },
    ],
    run: async (client, interaction) => {
        if(!message.member.permissions.has('MANAGE_MESSAGES')){
            return message.editReply('You don\'t have permissions for that :/');
        }
        let channel = args[0];
        if(!args[0]) channel = message.channel;
        let mc = await mcSchema.findOne({ channel: channel.id });
        if(!mc){
            mc = new mcSchema({
                channel: channel.id,
            });
            await mc.save();
        }
        else{
            return message.editReply('That channel is already muted!');
        }
        return message.editReply(`Successfully xp muted ${channel}`);
    },
};