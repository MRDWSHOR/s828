const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
var request = require('request').defaults({ encoding: null });

module.exports = class DogCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dog',
			aliases: ['puppy', 'doggy', 'doggo', 'woof'],
			group: 'animal',
			memberName: 'dog',
			description: 'Shows a random dog',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
      let url = "https://dog.ceo/api/breeds/image/random";
      request({url: url,json: true}, function (error, response, body) {
        let url2 = body["message"]
        let e = new MessageEmbed().setImage(url2).setColor(0xffee00).setTimestamp()
        message.channel.send(e)
      });
  }
}
