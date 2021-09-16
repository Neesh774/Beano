const { MessageEmbed } = require('discord.js');
const { GuildMember } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'shuffle',
    category: 'music',
    description: 'Shuffles the queue',
    run: async (client, interaction, args) => {
        if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
            return interaction.followUp({
                content: 'You are not in a voice channel!',
            });
        }

        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
            return void interaction.followUp({
                content: 'You are not in my voice channel!',
            });
        }

        const queue = client.player.getQueue(interaction.guildId);

        const filters = [];

        if (!queue || !queue.playing) {
            return interaction.followUp({
                content: 'No songs currently playing',
            });
        }
        await queue.shuffle();
        return interaction.followUp('Shuffled the queue 🔀');
    },
};
