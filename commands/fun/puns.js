const Command = require('../../structures/Command');
const Puns = require('../../arrays/puns.js');


module.exports = class PunsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'puns',
			aliases: ["pun"],
			group: 'fun',
			memberName: 'puns',
			description: 'Get a random pun',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    let myPuns = Puns.punList
    let max = myPuns.length - 1;
    let min = 0;
    let randomnumber = Math.floor(Math.random()*(max-min+1)+min);
    let chosenPun = myPuns[randomnumber];
    message.channel.send(String(chosenPun));
  };
}
