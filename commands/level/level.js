const Command = require('../../structures/Command');
const Users = require('../../databases/users.js');
const Servers = require('../../databases/servers.js');

module.exports = class LevelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'level',
			aliases: ['lvl'],
			group: 'level',
			memberName: 'level',
			description: 'Check your level',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    let sender = message.author
    if (message.guild) message.guild = {id: '326237705828564993'}
    Users.checkLevelling(sender.username, sender.id).then(res => {
      if (res === undefined) return message.channel.send("Unkown Error. Try again later.")
      if (res === 1) return message.channel.send("You have disabled levelling. Use `" + prefix + "enable` to re-enable.")
      Servers.checkLevelling(message.guild.id).then(res => {
        if (res === null) return message.channel.send("Unkown Error. Try again later.")
        if (res == false) return message.channel.send("Your admins have disabled levelling. To enable, ask them to type `" + prefix + "admin-enable`.")
    if (message.mentions.users.size >= 1) {
      var person = message.mentions.users.first();
      if (!person.bot) Users.xp(sender.id, person.username, message.channel);
      else message.channel.send("You cannot get information about a bot user.")
    } else {
      Users.level(sender.id, sender.username, message.channel);
    }
        })
    });
  };
}
  
