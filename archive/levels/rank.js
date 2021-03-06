const Discord = require('discord.js');
const config = require('../../config.json');
const mSchema = require('../../models/memberschema.js');
const canvacord = require('canvacord');
const functions = require('../../functions.js');
module.exports = {
    name: 'rank',
    category: 'levels',
    description: 'Beano tells you what level you\'re at',
    usage: `${config.prefix}rank [user]`,
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user you want the rank of',
            required: false,
        },
    ],
    run: async (client, interaction) => {
        let user = message.user;
        if(args[0]){
            guildMember = await functions.getMember(args[0], client, interaction.guild);
            user = guildMember.user;
        }
        const member = await mSchema.findOne({ userID: user.id });
        const list = await mSchema.find();
        let mRank = list.sort((a, b) => {
            return b.xp - a.xp;
          });
        try{
          mRank = mRank.map(x => x.xp).indexOf(member.xp) + 1;
        }
        catch(e){
            return message.editReply('I can\'t find that user.');
        }
        const currentlevelXP = await functions.getXP(member.level);
        const nextLevelXP = await functions.getXP(member.level + 1);
        const rank = new canvacord.Rank()
            .setAvatar(user.displayAvatarURL({ format: 'png', dynamic: 'false' }))
            .setCurrentXP(member.xp - currentlevelXP)
            .setRequiredXP(nextLevelXP - currentlevelXP)
            .renderEmojis(true)
            .setProgressBar('#3eafa7', 'COLOR')
            .setUsername(user.username)
            .setRank(mRank)
            .setLevel(member.level)
            .setDiscriminator(user.discriminator);

    rank.build()
        .then(data => {
            const attachment = new Discord.MessageAttachment(data, 'RankCard.png');
            message.editReply({ files: [attachment] });
        });
    },
};