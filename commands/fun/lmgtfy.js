const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { MessageEmbed } = require('discord.js');
var request = require('request').defaults({ encoding: null });

function splitMessage(str, n) {
  var chunks = [];

  for (var i = 0, charsLength = str.length; i < charsLength; i += n) {
    chunks.push(str.substring(i, i + n));
  }
  return chunks
}

module.exports = class LmgtfyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lmgtfy',
			aliases: [],
			group: 'fun',
			memberName: 'lmgtfy',
			description: 'Let me google that for you',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    let args = message.content.split(' ')
    args.shift()
    args = args.join()
    let query = args.replace(/ /g,"%20");
    message.channel.send(`http://www.lmgtfy.com/?iie=0&q=${query}`);
  };
}
