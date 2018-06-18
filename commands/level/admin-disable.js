const Command = require('../../structures/Command');
const Users = require('../../databases/users.js');
const Servers = require('../../databases/servers.js');

module.exports = class AdmindisableCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'admindisable',
			aliases: [],
			group: 'level',
			memberName: 'admindisable',
			description: 'Disable the levelling system for your server',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) return message.channel.send('This command is only available in a server.')
    else prefix = message.guild.commandPrefix 
    if (message.member.hasPermission("MANAGE_GUILD") || process.env.OWNERID.split(' ').includes(message.author.id)) {
      Servers.disable(message.guild.id);
      message.channel.send("You have disabled the levelling system on this server.")
    } else {
      message.channel.send("You do not have enough permissions to disable the levelling system on this server.")
    }
  }
}
  
