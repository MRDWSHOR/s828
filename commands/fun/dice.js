const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class DiceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dice',
			aliases: ["die", "roll"],
			group: 'fun',
			memberName: 'dice',
			description: 'Roll some dice...',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    var result = Math.floor((Math.random() * 6) + 1);
    message.channel.send(":game_die: You rolled a **`" + result + "`**.");
  }
}
