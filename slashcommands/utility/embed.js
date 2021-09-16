const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');
module.exports = {
	name: 'embed',
	category: 'Utility',
	usage: `${config.prefix}embed <TITLE> ++ <DESCRIPTION>`,
	description: 'Resends a message from you as an Embed',
	options: [
		{
			name: 'title',
			type: 'STRING',
			description: 'The title of your embed',
			required: true,
		},
		{
			name: 'description',
			type: 'STRING',
			description: 'The description of your embed',
			required: true,
		},
	],
	ephemeral: true,
	moderation: true,
	run: async (client, interaction) => {
		try {
			interaction.editReply({ content: 'Successfully sent the embed!', ephemeral: true });
			const title = interaction.options.getString('title');
			const desc = interaction.options.getString('description');
			interaction.channel.send({ embeds: [new MessageEmbed()
				.setColor(config.embedColor)
				.setTitle(title ? title : '')
				.setDescription(desc ? desc : '')] },
			);
			const AC = await client.guilds.fetch(config.AC);
			const logs = await AC.channels.cache.get(config.logs);
			const embed = new MessageEmbed()
				.setColor(config.embedColor)
				.setFooter(interaction.guild.name, interaction.guild.iconURL())
				.setTitle('Embed Command Used')
				.addField('Author', interaction.user.toString())
				.addField('Title', title)
				.addField('Description', desc)
				.setTimestamp();
			logs.send({ embeds: [embed] });
		}
		catch (e) {
			console.log(e.stack);
			return interaction.editReply({ content: ':x: There was an error. Please make sure you\'re using the proper arguments and try again.' });
		}
	},
};
