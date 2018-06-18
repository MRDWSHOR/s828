const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class CoinCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'coin',
			aliases: ["flip", "coinflip"],
			group: 'fun',
			memberName: 'coin',
			description: 'Flip a coin: heads or tails?',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    var result = Math.floor((Math.random() * 2) + 1);
    	if (result == 1) {
    		message.channel.send(":four_leaf_clover: The coin landed on **heads**");
    	} else if (result == 2) {
    		message.channel.send(":four_leaf_clover: The coin landed on **tails**");
    	}
  }
}
