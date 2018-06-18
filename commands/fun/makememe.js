const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
var request = require('request').defaults({ encoding: null });

function splitMessage(str, n) {
  var chunks = [];

  for (var i = 0, charsLength = str.length; i < charsLength; i += n) {
    chunks.push(str.substring(i, i + n));
  }
  return chunks
}

module.exports = class MakememeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'makememe',
			aliases: ['mememake', 'makeameme'],
			group: 'fun',
			memberName: 'makememe',
			description: 'Make a meme',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    
    if (message.deletable) message.delete()
    function edit(str) {
      let one = str.replace("_", "__").replace(" ", "_").replace("-", "--").replace("?", "~q")
      .replace("%", "~p").replace("#", "~h").replace("/", "~s").replace(`"`, `''`);
      return one
    }
    let args = message.content.split(' ')
    args.shift()
    args.join(" ").split('|')
    if (args.length !== 2) {
          
      return message.channel.send("Check the (complex) syntax: `" + prefix + "makememe [text on top] | [text on bottom]`.\nRemember to use the separator `|` and remove the `[]`!\nOh and don't forget to attach the image you want to turn into a meme.")
    }
    let top = args[0];
    let bottom = args[1];
    if (message.attachments.size === 1) {
        let url2 = "https://memegen.link/custom/" + edit(top) + "/" + edit(bottom) + ".jpg?alt=" + message.attachments.first().url;
        request(url2, function(err, response, buffer) {
          
          message.channel.send("Meme requested by `" + message.member.displayName + "`.",{ files: [{ attachment: buffer, name: 'SankOBot Meme Generator.png' }] })
        })
  } else {
    message.channel.send("Attach **1** image to make a meme out of.")
  }
  }
}
