const Command = require('../../structures/Command');
const Users = require('../../databases/users.js');
const Servers = require('../../databases/servers.js');
const { MessageEmbed } = require('discord.js');

function isEmoji(str) {
    return /[^ -~]/.test(str) ? true : false;
};

module.exports = class ChooseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'choose',
			aliases: ['choice'],
			group: 'level',
			memberName: 'choose',
			description: 'Change your background.',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    
    let sender = message.author;
    
    
    if (isEmoji(sender.username) !== false) {var senderName = isEmoji(sender.username) + "#" + sender.discriminator}
    else {var senderName = sender.username  + "#" + sender.discriminator};
        let e = new MessageEmbed()
        .setColor(0x36393e)
        .setImage("https://cdn.glitch.com/4555c474-f024-4d08-a673-3d6de1b10f0f%2Fall_3.jpg")
    
    if (message.content.split(' ').length == 1) {
        return message.channel.send(e)
      }
    if (!message.guild) message.guild = {id: '326237705828564993'}
    Servers.checkLevelling(message.guild.id).then(res => {
        if (res === null) return message.channel.send("Unkown Error. Try again later.")
        if (res == false) return message.channel.send("Your admins have disabled levelling. To enable, ask them to type `" + prefix + "admin-enable`.")
    Users.checkLevelling(sender.username, sender.id).then(res => {
      if (res === undefined) return message.channel.send("Unkown Error. Try again later.")
      if (res === 1) return message.channel.send("You have disabled levelling. Use `" + prefix + "enable` to re-enable.")
    let newChoice = parseInt(message.content.split(" ")[1])
    if (newChoice != 1 && newChoice != 2 && newChoice != 3 && newChoice != 4 && newChoice != 5) 
        return message.channel.send(e)
    Users.choose(senderName, sender.id, newChoice, message.channel, prefix)
    });
    })
  };
}
  
