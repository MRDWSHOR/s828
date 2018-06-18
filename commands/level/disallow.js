const Command = require('../../structures/Command');
const Users = require('../../databases/users.js');
const Servers = require('../../databases/servers.js');

module.exports = class DisableCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'disallow',
			aliases: [],
			group: 'level',
			memberName: 'disallow',
			description: 'Disable the levelling system for you',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    Users.disable(message.author.username, message.author.id, message.channel, prefix)
  }
}
  
