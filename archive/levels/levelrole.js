const Discord = require('discord.js');
const config = require('../../config.json');
const lSchema = require('../../models/levelroleschema.js');
module.exports = {
    name: 'levelrole',
    category: 'levels',
    description: 'Beano will automatically give users a role when they get to a certain level',
    usage: `${config.prefix}levelrole <role> <level>`,
    options: [
        {
            name: 'role',
            type: 'ROLE',
            description: 'The role you want to give',
            required: true,
        },
        {
            name: 'level',
            type: 'INTEGER',
            description: 'The level you want users to get to for the role',
            required: true,
        },
    ],
    run: async (client, interaction) => {
    // command
        const role = args[0];

        const levelNum = args[1];
        if(!levelNum || levelNum < 0){
            return message.editReply({ content: ':X | **Couldn\'t set that level' });
        }

        const lr = new lSchema({
            roleID: role.id,
            level: levelNum,
        });
        lr.save();
        return message.editReply({ content: `Successfully set to give users the role ${role.name} when they get to level ${levelNum}` });
    },
};