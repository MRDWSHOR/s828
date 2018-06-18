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

module.exports = class JokeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'joke',
			aliases: [],
			group: 'fun',
			memberName: 'joke',
			description: 'Get a joke.',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    let rannum = Math.floor((Math.random() * 2) + 1);
    function sendJoke(j) {
      let js = splitMessage(String(j), 1000)
      var embed = new MessageEmbed()
      .setTimestamp()
      .setColor(0xffee00)
      for (var i = 0; i < js.length; i++) {
        embed.addField("__ __", js[i])
      }
      message.channel.send(embed)
    }
    var JOKE = "";
    let url1 = "https://raw.githubusercontent.com/taivop/joke-dataset/master/stupidstuff.json";
    let url2 = "https://raw.githubusercontent.com/taivop/joke-dataset/master/wocka.json";
    if (rannum === 1) {
      request({url: url1,json: true}, function (error, response, body) {
        let r = Math.floor((Math.random() * (body.length - 1)));
        JOKE = body[r].body
        sendJoke(JOKE)
      });
    }
    if (rannum === 2) {
      request({url: url2,json: true}, function (error, response, body) {
        let r = Math.floor((Math.random() * (body.length - 1)));
        JOKE = body[r].body
        sendJoke(JOKE)
      });
    }
  }
}
