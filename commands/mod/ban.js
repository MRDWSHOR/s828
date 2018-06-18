const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class BanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ban',
			aliases: [],
			group: 'mod',
			memberName: 'ban',
			description: "Ban a member of the guild",
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) return message.channel.send('This command is only available in a server.')
    else prefix = message.guild.commandPrefix 
    
     if(!message.member.hasPermission("BAN_MEMBERS")) {
      return message.channel.send("You don't have enough permissions to ban someone.");
     }
    let member = message.mentions.members.first();
    if(!member) {
      return message.channel.send("Mention someone to ban.");
    }
    if(!member.bannable) {
      return message.channel.send("The person who you requested to ban has more permissions than me.");
    }
    
    let reason = "SankOBot Ban"
    
    let filter = m => m.author === message.author
    message.channel.send("Banning: `" + member.displayName + "`. Use `" + prefix + "confirm` to ban (`20`s).")
    message.channel.awaitMessages(filter, { max: 1, time: 20000, errors: ['time'] })
      .then(collected => {if (collected.first().content === prefix + "confirm") {
    
    member.ban(reason)
      .catch(error => message.channel.send(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.channel.send(":bangbang: `" + member.user.tag + "` has been banned by `" + message.author.tag + "`. \nReason: `" + reason + "`");
  
  } else {message.channel.send("Ban Cancelled")}})
      .catch(() => message.channel.send("Ban Cancelled"));
  }
}
