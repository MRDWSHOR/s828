const Command = require('../../structures/Command');
const GoogleImages = require('google-images');
const client = new GoogleImages(process.env.GOOGLE_CX, process.env.GOOGLE_SEARCH_KEY);
const { MessageEmbed } = require('discord.js');
var request = require('request').defaults({ encoding: null });

module.exports = class QuoteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'quote',
			aliases: [],
			group: 'fun',
			memberName: 'quote',
			description: 'Get a quote.',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    let requrl = "http://api.forismatic.com/api/1.0/?method=getQuote&key=1&format=json&lang=en"
    request({url: requrl,json: true}, function (error, response, body) {
      let quote = body.quoteText;
      let by = body.quoteAuthor
      client.search(by).then(images => {
        let img = images[0].url;
        let embed= new MessageEmbed()
          .setDescription(quote)
          .setFooter(by)
          .setColor(0xffee00)
          .setThumbnail(img)
        message.channel.send(embed)
      })
      
    });
  }
}
