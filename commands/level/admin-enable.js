const Command = require('../../structures/Command');
const Users = require('../../databases/users.js');
const Servers = require('../../databases/servers.js');

module.exports = class AdminenableCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'adminenable',
			aliases: [],
			group: 'level',
			memberName: 'adminenable',
			description: 'Enable the levelling system for your server (default)',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) return message.channel.send('This command is only available in a server.')
    else prefix = message.guild.commandPrefix 
    if (message.member.hasPermission("MANAGE_GUILD") || process.env.OWNERID.split(' ').includes(message.author.id)) {
      Servers.enable(message.guild.id);
      message.channel.send("You have enabled the levelling system on this server.")
    } else {
      message.channel.send("You do not have enough permissions to enable the levelling system on this server.")
    }
  }
}
  
