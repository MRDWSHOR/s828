const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
var request = require('request').defaults({ encoding: null });

module.exports = class DuckCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'duck',
			aliases: ['quack'],
			group: 'animal',
			memberName: 'duck',
			description: 'Shows a random duck',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    let url = "https://api.random-d.uk/random";
    request({url: url,json: true}, function (error, response, body) {
      let u = body.url
      let e = new MessageEmbed().setImage(u).setColor(0xffee00).setTimestamp()
      message.channel.send(e)
    })
  }
}
