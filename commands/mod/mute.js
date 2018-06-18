const Command = require('../../structures/Command');

function mute(message, member) {
  let reason = "SankOBot Mute"
  let user = member.user
  if (message.mentions.users.size < 1) return message.reply('You must mention someone to mute them.').catch(console.error);
  let person = `${user.username}#${user.discriminator}`
   let mod = `${message.author.username}#${message.author.discriminator}`
   let Cs = message.guild.channels.filter(c => c.type === 'text')
   for (var i = 0; i < Cs.size; i++) {
     let c = Cs.array()[i]
     if (c.permissionsFor(c.guild.me).has('MANAGE_CHANNELS')){
     c.overwritePermissions(member, {SEND_MESSAGES: false})
     }
   }
  message.channel.send("`" + person + "` has been muted by `" + mod + "`")
}

module.exports = class MuteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'mute',
			aliases: [],
			group: 'mod',
			memberName: 'mute',
			description: "Mute a member of the guild",
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) return message.channel.send('This command is only available in a server.')
    else prefix = message.guild.commandPrefix 
    if (!message.member.hasPermission("MANAGE_ROLES")) {
      return message.channel.send("You do not have enough permissions to mute someone.")
    }
    let member = message.mentions.members.first();
    if(!member) {
      return message.channel.send("Mention someone to mute.");
    }
    if(!message.guild.me.hasPermission("MANAGE_ROLES")) {
      return message.channel.send("I do not have enough permissions to mute someone. Make sure i have permissions to `Manage roles`.");
    }
    if(message.guild.me.roles.highest.calculatedPosition <= member.roles.highest.calculatedPosition) {
      return message.channel.send("The mentioned member has higher permissions than me.");
    }
    mute(message, member)
  }
}
