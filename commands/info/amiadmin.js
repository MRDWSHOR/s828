const Command = require('../../structures/Command');

module.exports = class AmiadminCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'amiadmin',
			aliases: ['admin'],
			group: 'info',
			memberName: 'amiadmin',
			description: 'Are you admin?',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    if (message.member.hasPermission("ADMINISTRATOR")) message.channel.send("Yes, you are admin.")
    else message.channel.send("No, you are not admin")
  }

}
