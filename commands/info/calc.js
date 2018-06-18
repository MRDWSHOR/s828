const Command = require('../../structures/Command');
var request = require('request').defaults({ encoding: null });

module.exports = class CalcCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'calc',
			aliases: ['calculator', 'math', 'maths'],
			group: 'info',
			memberName: 'calc',
			description: 'Calculate any maths sum that you can type',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    let m = message.content.split(' ')
    m.shift()
    m = m.join(' ')
    let eq = encodeURIComponent(m);
    request({url: "https://www.calcatraz.com/calculator/api?c=" + eq}, function (error, response, body) {
      if (String(body).startsWith("answer")) {
        message.channel.send("The equation is invalid.");
      }
      else message.channel.send("Answer: `" + body + "`.");
    })
  }
}
