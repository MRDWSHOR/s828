const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { Imgur_ClientID } = process.env;

module.exports = class ImgurCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'imgur',
			aliases: ['imgur-image'],
			group: 'info',
			memberName: 'imgur',
			description: 'Searches Imgur for your query.',
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
				.get('https://api.imgur.com/3/gallery/search')
				.query({ q: query })
				.set({ Authorization: `Client-ID ${Imgur_ClientID}` });
			const images = body.data.filter(image => image.images && (msg.channel.nsfw ? true : !image.nsfw));
			if (!images.length) return msg.say('Could not find any results.');
      let img = images[Math.floor(Math.random() * images.length)].images[0]
      if (img.nsfw && !msg.chanel.nsfw) return msg.channel.send('This is an NSFW image and can only be viewed in an NSFW channel.')
			else return msg.say(img.link);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};