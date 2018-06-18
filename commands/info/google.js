const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { MessageEmbed } = require('discord.js');
const {google} = require('googleapis');
const customsearch = google.customsearch('v1');

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}


module.exports = class GoogleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'google',
			aliases: ['search', 'find'],
			group: 'info',
			memberName: 'google',
			description: 'Search Google for something',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    let split = message.content.split(" ")
      split.shift()
    split = split.join(" ")
    customsearch.cse.list({
      cx: process.env.GOOGLE_CX,
      q: split,
      auth: process.env.GOOGLE_SEARCH_KEY,
      safe: 'high',
      num: 5
    }, (err, res) => {
      if (err) message.channel.send("Error: ```fix\n" + err + "```")
      else {
        var embed = new MessageEmbed()
          .setTimestamp()
          .setColor(0x0057e7)
          .setDescription("_ _\n_ _")
          .setTitle("Search results for: __" + split.capitalize() + "__")
        for (var i = 0; i < res.data.items.length; i++) {
          let v = res.data.items[i]
          let main = "[" + v.displayLink + "](" + v.link + ")\n" + v.snippet + "\n_ _"
          embed.addField(v.title, main)
        }
        message.channel.send(embed)
      }
    })
  }
}
