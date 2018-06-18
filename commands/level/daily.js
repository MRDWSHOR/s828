const Command = require('../../structures/Command');
const Users = require('../../databases/users.js');
const Servers = require('../../databases/servers.js');

function isEmoji(str) {
    return /[^ -~]/.test(str) ? true : false;
};

module.exports = class DailyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'daily',
			aliases: ['credits', 'collect'],
			group: 'level',
			memberName: 'daily',
			description: 'Collect your daily credits',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
      if (isEmoji(message.author.username) !== false) {var senderName = isEmoji(message.author.username) + "#" + message.author.discriminator}
      else {var senderName = message.author.username  + "#" + message.author.discriminator};
      if (message.guild) message.guild = {id: '326237705828564993'}
      Servers.checkLevelling(message.guild.id).then(res => {
        if (res === null) return message.channel.send("Unkown Error. Try again later.")
        if (res == false) return message.channel.send("Your admins have disabled levelling. To enable, ask them to type `" + prefix + "admin-enable`.")
        Users.checkLevelling(message.author.username, message.author.id).then(res => {
          if (res === undefined) return message.channel.send("Unkown Error. Try again later.")
          if (res === 1) return message.channel.send("You have disabled levelling. Use `" + prefix + "enable` to re-enable.")
          Users.addCredits(senderName, message.author.id, message.channel, prefix);
        })
    });
  };
}
  
