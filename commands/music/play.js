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

module.exports = class PlayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'play',
			aliases: [],
			group: 'music',
			memberName: 'play',
			description: 'Play the queue',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) return message.channel.send('This command is only available in a server.')
    else prefix = message.guild.commandPrefix 
    request({url: `http://${process.env.PROJECT_DOMAIN}.glitch.me/queue.json`, json: true}, function(er, fields, queue) {

		if (queue[message.guild.id] === undefined) return message.channel.send("Add some songs to the queue first with `" + prefix + "add`");
		if (!message.guild.voiceConnection) return message.channel.send("I am not in a voice channel. Join one and use the command `" + prefix + "join`.");
		if (queue[message.guild.id].playing) return message.channel.send('Already Playing');
		let dispatcher;
		queue[message.guild.id].playing = true;
		(function play(song) {
			if (song === undefined) return message.channel.send('The queue is empty. Add song with `' + prefix + 'add`.').then(() => {
				queue[message.guild.id].playing = false;
				message.guild.voiceConnection.channel.leave();
			});
			message.channel.send(`Playing: **${song.title}** as requested by: **${song.requester}**`);
			dispatcher = message.guild.voiceConnection.play(yt(song.url, { filter: "audioonly" }), { passes : 1 });
			let collector = message.channel.createMessageCollector(m => m);
			collector.on('collect', m => {
				if (m.content.startsWith(prefix + 'pause')) {
					message.channel.send('Paused song.').then(() => {dispatcher.pause();});
          return
				} else if (m.content.startsWith(prefix + 'resume')){
					message.channel.send('Resumed song.').then(() => {dispatcher.resume();});
          return
				} else if (m.content.startsWith(prefix + 'skip')){
					message.channel.send('Skipped song.').then(() => {
            dispatcher.end()
            request({url: `http://${process.env.PROJECT_DOMAIN}.glitch.me/queue.json`, json: true}, function(er, fields, queue) {
              let n = queue[message.guild.id].songs.shift()
              upload(queue);
              play(n);
            })
            collector.stop()
          });
          return
				} else if (m.content.startsWith(prefix + 'volume')){
					if (Math.round(dispatcher.volume*50) <= 0) return message.channel.send(`Volume set to **: ${Math.round(dispatcher.volume*50)}**`);
					dispatcher.setVolume(Math.max(((m.content.split(' ')[1])))/50,0);
					message.channel.send(`Volume: ${Math.round(dispatcher.volume*50)}`);
          return
				} else if (m.content.startsWith(prefix + 'time')){
					message.channel.send(`Current position: ${Math.floor(dispatcher.streamTime / 60000)}:${Math.floor((dispatcher.streamTime % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.streamTime % 60000)/1000) : Math.floor((dispatcher.streamTime % 60000)/1000)}`);
				  return
        }
			});
      
			dispatcher.on('error', (err) => {
				return message.channel.send('error: ' + err).then(() => {
					collector.stop();
					play(queue[message.guild.id].songs.shift());
          upload(queue)
				});
			});
		})(queue[message.guild.id].songs.shift());
      upload(queue)
  })
  }
}
