var figlet = require('figlet');
const config = require('../../config.json');

module.exports = {
	name: 'ascii',
	category: 'fun',
	description: 'Converts text info ASCII',
	usage: `${config.prefix}ascii <text>`,
	options: [
		{
			name: 'text',
			type: 'STRING',
			description: 'The text you want to ascii-ify.',
			required: true,
		},
	],
	run: async (client, message, args) => {
		// command
		var maxLen = 100;

    if(args.join(' ').length > maxLen) return message.editReply({ content: `The max length is ${maxLen}!` })

    if(!args[0]) return message.editReply({ content: 'Please enter some text.' });

		figlet(`${args.join(' ')}`, function(err, data) {
			if (err) {
				console.dir(err);
				return;
			}

        message.editReply({ content: `\`\`\`${data}\`\`\`` });
    });
  },
};