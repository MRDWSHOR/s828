const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
var request = require('request').defaults({ encoding: null });

module.exports = class LionCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lion',
			aliases: [],
			group: 'animal',
			memberName: 'lion',
			description: 'Shows a random lion',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    request({url: 'https://animals.anidiots.guide/lion', json: true}, function(error, response, body) {
      let url = body.link;
      let e = new MessageEmbed().setImage(url).setColor(0xffee00).setTimestamp()
      message.channel.send(e)
    })
  }
}
