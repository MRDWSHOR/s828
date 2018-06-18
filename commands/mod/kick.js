const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class KickCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kick',
			aliases: [],
			group: 'mod',
			memberName: 'kick',
			description: "Kick a member of the guild",
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) return message.channel.send('This command is only available in a server.')
    else prefix = message.guild.commandPrefix 
    
     if(!message.member.hasPermission("KICK_MEMBERS")) {
      return message.channel.send("You don't have enough permissions to kick someone.");
     }
    
    let member = message.mentions.members.first();
    if(!member) {
      return message.channel.send("Mention someone to kick.");
    }
    if(!member.kickable) 
      return message.channel.send("My permissions are not high enough for me to kick `" + member.user.username + "`.");
    
    let filter1 = m => m.author === message.author

    let reason = "SankOBot Kick"
    
    let filter = m => m.author === message.author
    message.channel.send("Kicking: `" + member.displayName + "`. Use `" + prefix + "confirm` to kick (`20`s).")
    message.channel.awaitMessages(filter, { max: 1, time: 20000, errors: ['time'] })
      .then(collected => {if (collected.first().content === prefix + "confirm") {
        
    member.kick(reason)
      .catch(error => message.channel.send(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.channel.send(":bangbang: `" + member.user.tag + "` has been kicked by `" + message.author.tag + "`.");
  
  } else {message.channel.send("Kick Cancelled")}})
      .catch(() => message.channel.send("Kick Cancelled"));
  }
}
