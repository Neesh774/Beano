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
	moderation: true,
	run: async (client, interaction) => {
		// command
		const string = interaction.options.getString('text');
		const AC = await client.guilds.fetch(config.AC);
		const logs = await AC.channels.cache.get(config.logs);
		const embed = new Discord.MessageEmbed()
				.setColor(config.embedColor)
				.setFooter(interaction.guild.name, interaction.guild.iconURL())
				.setTitle('Say Command Used')
				.addField('Author', interaction.user.toString())
				.addField('Said', string)
				.setTimestamp();
			logs.send({ embeds: [embed] });
		interaction.editReply({ content: `Successfully said ${string}`, ephemeral: true }).then(()=> {
			return interaction.channel.send({ content: string });
		});
	},
};