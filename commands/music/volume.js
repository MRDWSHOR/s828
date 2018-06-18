const Command = require('../../structures/Command');
var search = require('youtube-search');
const yt = require('ytdl-core');
var request = require('request').defaults({ encoding: null });

var opts = {
  maxResults: 1,
  key: process.env.YoutubeSearch,
  type: "video"
};

module.exports = class VolumeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'volume',
			aliases: [],
			group: 'music',
			memberName: 'volume',
			description: 'Set the volume (0-100)',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) return message.channel.send('This command is only available in a server.')
    else prefix = message.guild.commandPrefix 
    request({url: `http://${process.env.PROJECT_DOMAIN}.glitch.me/queue.json`, json: true}, function(er, fields, queue) {
      if (queue == {} || queue == undefined) {return message.channel.send('You can only use this command when playing a song.')}
    })
  }
}
