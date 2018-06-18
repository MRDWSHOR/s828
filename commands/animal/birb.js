const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
var request = require('request').defaults({ encoding: null });

module.exports = class BirbCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'birb',
			aliases: ['bird'],
			group: 'animal',
			memberName: 'birb',
			description: 'Shows a random birb (meme bird)',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    request({url: 'http://random.birb.pw/tweet.json/', json: true}, function(error, response, body) {
      let url = "https://random.birb.pw/img/" + body.file;
      let e = new MessageEmbed().setImage(url).setColor(0xffee00).setTimestamp()
      message.channel.send(e)
    })
  }
}
