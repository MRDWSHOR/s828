const Command = require('../../structures/Command');
var request = require('request').defaults({ encoding: null });



module.exports = class LeaveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'leave',
			aliases: [],
			group: 'music',
			memberName: 'leave',
			description: 'Leaves the current voice channel',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) return message.channel.send('This command is only available in a server.')
    else prefix = message.guild.commandPrefix 
    request({url: `http://${process.env.PROJECT_DOMAIN}.glitch.me/queue.json`, json: true}, function(er, fields, queue) {
      if (queue[message.guild.id] !== undefined && queue[message.guild.id].playing) {
        return message.channel.send("Playing a song. Wait for the queue to end before leaving the voice channel.")
      }
      else if (!message.guild.voiceConnection) {
        return message.channel.send("I am not in a voice channel to leave.")
      }
      else {
        message.guild.voiceConnection.disconnect()
        message.channel.send("Left voice channel.")
      }
    })
    }
}
