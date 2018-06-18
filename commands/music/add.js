const Command = require('../../structures/Command');
var search = require('youtube-search');
const yt = require('ytdl-core');
var request = require('request').defaults({ encoding: null });

var opts = {
  maxResults: 1,
  key: process.env.YoutubeSearch,
  type: "video"
};

function upload(q) {
  request({url: `http://${process.env.PROJECT_DOMAIN}.glitch.me/upload.json?new=${encodeURIComponent(JSON.stringify(q))}`, json: true}, function(er, fields, res) {})
}

module.exports = class AddCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'add',
			aliases: [],
			group: 'music',
			memberName: 'add',
			description: 'Add a song to the queue (by youtube URL or name)',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) return message.channel.send('This command is only available in a server.')
    else prefix = message.guild.commandPrefix 
    
    request({url: `http://${process.env.PROJECT_DOMAIN}.glitch.me/queue.json`, json: true}, function(er, fields, queue) {
		let url = message.content.split(' ')[1];
    let args = message.content.replace(prefix + "add ", "")
		if (url == '' || url === undefined) return message.channel.send(`You must add a YouTube video url, or id after ${prefix}add`);
		yt.getInfo(url, (err, info) => {
			if(err) {
        search(args, opts, function(err, results) {
        if(err) return console.log(err);
          if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
		    	queue[message.guild.id].songs.push({url: results[0].link, title: results[0].title, requester: message.author.username});
          message.channel.send("Added **" + results[0].link + "** to the queue.");
          upload(queue)
        });
        return
      };
			if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
			queue[message.guild.id].songs.push({url: url, title: info.title, requester: message.author.username});
			message.channel.send("Added **" + info.title+ "** to the queue.");
      upload(queue)
		});
    var failed = false
    const voiceChannel = message.member.voiceChannel;
			if (!voiceChannel || voiceChannel.type !== 'voice') {
        var failed = true
      } else voiceChannel.join()
    if (queue[message.guild.id] === undefined) {message.channel.send("Use `" + prefix + "play`")} else {
      if (!failed===true && !queue[message.guild.id].playing) {message.channel.send("Use `" + prefix + "play`")}
    }
  })
  }
}
