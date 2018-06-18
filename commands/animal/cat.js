const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
var request = require('request').defaults({ encoding: null });

module.exports = class CatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cat',
			aliases: ['pussy', 'neko', 'meow'],
			group: 'animal',
			memberName: 'cat',
			description: 'Shows a random cat',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
      let url = "http://thecatapi.com/api/images/get?format=src";
      request({url: url,json: true}, function (error, response, body) {
        let e = new MessageEmbed().setImage(response.request.href).setColor(0xffee00).setTimestamp()
        message.channel.send(e)
      })
  }
}
