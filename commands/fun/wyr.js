const Command = require('../../structures/Command');
const WouldYouRather = require('../../arrays/would-you-rather.js');

module.exports = class RandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'wyr',
			aliases: ["would-you-rather", "wouldyourather"],
			group: 'fun',
			memberName: 'wyr',
			description: 'Ask yourself, would you rather...',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    let mywyr = WouldYouRather.list
    let max = mywyr.length - 1;
    let min = 0;
    let randomnumber = Math.floor(Math.random()*(max-min+1)+min);
    let chosen = mywyr[randomnumber];
    message.channel.send(String(chosen));
  };
}
