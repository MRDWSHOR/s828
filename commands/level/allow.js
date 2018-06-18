const Command = require('../../structures/Command');
const Users = require('../../databases/users.js');
const Servers = require('../../databases/servers.js');

module.exports = class EnableCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'allow',
			aliases: [],
			group: 'level',
			memberName: 'allow',
			description: 'Enable the levelling system for you',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    Users.enable(message.author.username, message.author.id, message.channel, prefix)
  }
}
  
