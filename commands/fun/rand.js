const Command = require('../../structures/Command');

module.exports = class RandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rand',
			aliases: ["random", "rng"],
			group: 'fun',
			memberName: 'rand',
			description: 'Get a random number between 2 numbers.',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    let args = message.content.split(' ');
    args.shift()
    if (parseInt(args[0]) > parseInt(args[1])) {
      async function errorMsg() {
            message.channel.send("Check your syntax: `%rand [x] [y]`, where [x] is a number smaller than [y]. ([x] < [y])");
        return
    }errorMsg();
      return
    }
    let min = parseInt(args[0])
    let max = parseInt(args[1])
    let dist = parseInt(max - min)
    let rn = Math.floor(Math.random()*dist);
    let randomnumber = min + rn
    async function randomNumber() {
      message.channel.send("Your random number is: **__" + String(randomnumber) + "__**!");
    }randomNumber();
  };
}
