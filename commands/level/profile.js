const Command = require('../../structures/Command');
const Users = require('../../databases/users.js');
const Servers = require('../../databases/servers.js');
const Img = require('../../databases/image.js');

function isEmoji(str) {
    return /[^ -~]/.test(str) ? true : false;
};

module.exports = class ProfileCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'profile',
			aliases: ['prf'],
			group: 'level',
			memberName: 'profile',
			description: 'Get your profile',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    let sender = message.author
    
    if (message.content.split(" ").length === 1) {
      
      let nm;
      if (!isEmoji(sender.username)) {nm = sender.username}
      else if (!isEmoji(message.member.displayName)) {nm = message.member.displayName}
      else {nm = "Non English Name"}
      if (!message.guild) message.guild = {id: '326237705828564993'}
      Servers.checkLevelling(message.guild.id).then(res => {
        if (res === null) return message.channel.send("Unkown Error. Try again later.")
        if (res == false) return message.channel.send("Your admins have disabled levelling. To enable, ask them to type `" + prefix + "admin-enable`.")
      Users.checkLevelling(sender.username, sender.id).then(res => {
        if (res === undefined) return message.channel.send("Unkown Error. Try again later.")
        if (res === 1) return message.channel.send("You have disabled levelling. Use `" + prefix + "enable` to re-enable.")
      Img.edit(nm, sender.id, sender, message.channel);
      });
      })
    } else if (message.mentions.users.size >= 1) {
      var person = message.mentions.members.first();
      let nm;
      if (!isEmoji(person.user.username)) {nm = person.user.username}
      else if (!isEmoji(person.displayName)) {nm = person.displayName}
      else {nm = "Non English Name"}
      if (!person.user.bot) Img.edit(nm, person.id, person.user, message.channel);
      else message.channel.send("You cannot get information about a bot user.")
      }
  }
}
  
