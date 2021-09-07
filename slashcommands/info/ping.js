const config = require('../../config.json');

module.exports = {
    name: 'ping',
	aliases: ['latency'],
    category: 'info',
    description: 'Returns latency and API ping',
    usage: `${config.prefix}ping`,
    options: [],
    run: async (client, message, args) => {
		message.editReply({ content: `🏓 Pong!
        API Latency is ${Math.round(client.ws.ping)}ms` });
	},
};
