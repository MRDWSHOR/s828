const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
var request = require('request').defaults({ encoding: null });

module.exports = class PandaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'panda',
			aliases: [],
			group: 'animal',
			memberName: 'panda',
			description: 'Shows a random panda',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    request({url: 'https://animals.anidiots.guide/panda', json: true}, function(error, response, body) {
      let url = body.link;
      let e = new MessageEmbed().setImage(url).setColor(0xffee00).setTimestamp()
      message.channel.send(e)
    })
  }
}
