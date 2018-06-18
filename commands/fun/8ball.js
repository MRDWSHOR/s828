const Command = require('../../structures/Command');

module.exports = class BallCommand extends Command {
	constructor(client) {
		super(client, {
			name: '8ball',
			aliases: [],
			group: 'fun',
			memberName: '8ball',
			description: 'Ask the 8ball a question...',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    var sayings = ["It is certain", "It is decidedly so", "Without a doubt", "Yes, definitely",
										"You may rely on it", "As I see it, yes", "Most likely", "Outlook good",
										"Yes", "Signs point to yes", "Reply hazy try again", "Ask again later",
										"Better not tell you now", "Cannot predict now", "Concentrate and ask again",
										"Don't count on it", "My reply is no", "My sources say no", "Outlook not so good",
										"Very doubtful"];
    var result = Math.floor((Math.random() * sayings.length));
    message.channel.send(":8ball: According to the 8ball: ```" + sayings[result] + "```")
  }
}
