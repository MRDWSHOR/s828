const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
var Spotify = require('node-spotify-api');
const { MessageEmbed } = require('discord.js');
var request = require('request').defaults({ encoding: null });

function splitMessage(str, n) {
  var chunks = [];

  for (var i = 0, charsLength = str.length; i < charsLength; i += n) {
    chunks.push(str.substring(i, i + n));
  }
  return chunks
}

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

module.exports = class LyricsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lyrics',
			aliases: ['songs', 'song', "songinfo"],
			group: 'info',
			memberName: 'lyrics',
			description: 'Get lyrics and other song information',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    
    let s = message.content.split(' ')
    s.shift()
    s = s.join(" ")
    if (s.length < 1) {
      return message.channel.send("Check the syntax. `" + prefix + "lyrics [song name]`")}
    //logging into spotify
    var spotify = new Spotify({
      id: process.env.spotifyId,
      secret: process.env.spotifySecret
    });
    spotify.search({ type: 'track', query: s }, function(err, data) {
      if (err) {
        if (err === "TypeError: Cannot read property 'name' of undefined") {
        return message.channel.send("I was unable to find the song `" + s + "`")
        } else return message.channel.send("Error: ```fix\n" + err   + "```")
      }
      else {
        let name = data.tracks.items[0].name
        let artists = "";
        for (var i = 0; i < data.tracks.items[0].artists.length; i++) artists += data.tracks.items[0].artists[i].name + ", "
        let id = data.tracks.items[0].id
        let long = millisToMinutesAndSeconds(data.tracks.items[0].duration_ms)
        let url = "https://lyric-api.herokuapp.com/api/find/" + encodeURIComponent(data.tracks.items[0].artists[0].name) + "/" + encodeURIComponent(name)
        request({url: url,json: true}, function (error, response, body) {
          if (error) return message.channel.send("Error: ```fix\n" + error   + "```")
          if (body.err !== "none") return message.channel.send("Error: ```fix\n" + body.err + "```")
          let lyrics = splitMessage(String(body.lyric), 1000)
          var embed = new MessageEmbed()
            .setTitle("__" + name + "__")
            .setColor(0xffee00)
            .addField("Artist(s)", artists.slice(0, -2))
            .addField("Lasts for", long)
            .addField("Lyrics", "_ _")
          if (lyrics.length == 0) embed.addField("Lyrics not found...")
          for (var i = 0; i < lyrics.length; i ++) {
            embed.addField("_ _", lyrics[i])
          }
          message.channel.send(embed)
        })
      }
      });
  };
}
