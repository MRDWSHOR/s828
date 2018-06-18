const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { shorten } = require('../../util/Util');

module.exports = class NASACommand extends Command {
	constructor(client) {
		super(client, {
			name: 'nasa',
			aliases: ['nasa-image'],
			group: 'info',
			memberName: 'nasa',
			description: 'Search the NASA archives for an image.',
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'query',
					prompt: 'What image would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await request
				.get('https://images-api.nasa.gov/search')
				.query({
					q: query,
					media_type: 'image'
				});
			const images = body.collection.items;
			if (!images.length) return msg.say('Could not find any results.');
			const data = images[Math.floor(Math.random() * images.length)];
			return msg.say(shorten(data.data[0].description.split('<')[0]), { files: [data.links[0].href] });
		} catch (err) {
			return msg.reply(`Error: \`${err.message}\`. Try again later!`);
		}
	}
};