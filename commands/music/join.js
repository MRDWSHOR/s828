const Command = require('../../structures/Command');

module.exports = class JoinCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'join',
			aliases: [],
			group: 'music',
			memberName: 'join',
			description: 'Joins a voice channel (that you are in) to play music',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) return message.channel.send('This command is only available in a server.')
    else prefix = message.guild.commandPrefix 
		const voiceChannel = message.member.voiceChannel;
		if (!voiceChannel || voiceChannel.type !== 'voice') {
      message.channel.send('I couldn\'t connect to your voice channel. Make sure you are in a voice channel and that I have permissions to speak and connect to it.')
      return null
    };
    voiceChannel.join().then(c => {message.channel.send(`Joined ${c.channel.name}.`)}).catch(err => message.channel.send("Error: ```fix\n" + err.message.replace("You", "I") + "```"));
	}
}
