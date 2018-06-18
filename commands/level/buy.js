const Command = require('../../structures/Command');
const Users = require('../../databases/users.js');
const Servers = require('../../databases/servers.js');
const { MessageEmbed } = require('discord.js');

function isEmoji(str) {
    return /[^ -~]/.test(str) ? true : false;
};

module.exports = class BuyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'buy',
			aliases: [],
			group: 'level',
			memberName: 'buy',
			description: 'Buy a new background or see the shop',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    let sender = message.author
    let msg = message.content
    
    if (isEmoji(message.author.username) !== false) {var senderName = isEmoji(message.author.username) + "#" + message.author.discriminator}
    else {var senderName = message.author.username  + "#" + message.author.discriminator};
    if (message.guild) message.guild = {id: '326237705828564993'}
    Servers.checkLevelling(message.guild.id).then(res => {
        if (res === null) return message.channel.send("Unkown Error. Try again later.")
        if (res == false) return message.channel.send("Your admins have disabled levelling. To enable, ask them to type `" + prefix + "admin-enable`.")
    Users.checkLevelling(sender.username, sender.id).then(res => {
      if (res === undefined) return message.channel.send("Unkown Error. Try again later.")
      if (res === 1) return message.channel.send("You have disabled levelling. Use `" + prefix + "enable` to re-enable.")
      if (msg.split(" ").length === 1) {
        let e = new MessageEmbed()
        .setColor(0x36393e)
        .setImage("https://cdn.glitch.com/4555c474-f024-4d08-a673-3d6de1b10f0f%2Fall_3.jpg")
        message.channel.send(e)
      } else {
        message.channel.send("You are about to attempt to buy background `" + msg.split(" ")[1] + "`. Use `" + prefix + "confirm` to continue...")
        let filter = m => m.author.id === sender.id
        message.channel.awaitMessages(filter, { max: 1 })
          .then(
          collected => {
            if (collected.first().content === prefix + "confirm") {
              let toBuy = parseInt(msg.split(" ")[1])
              Users.buy(senderName, sender.id, toBuy, message.channel, prefix)
            } else {message.channel.send("Aborted...")}
          })
          .catch(collected => message.channel.send("Aborted..."));
      };
    })
    })
  }
  
  
}
  
