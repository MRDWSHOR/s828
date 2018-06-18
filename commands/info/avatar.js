const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class AvatarCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'avatar',
			aliases: ['profilepic', 'image'],
			group: 'info',
			memberName: 'avatar',
			description: 'Get the avatar of a mentioned user or yourself',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    let person = message.mentions.users.first() || message.author
    var embed = new MessageEmbed()
    .setTimestamp()
    .setColor(0xef7902)
    .setImage(person.displayAvatarURL())
      .setFooter("SankOBot", message.client.user.displayAvatarURL())
    message.channel.send("Avatar for `" + person.tag + "`", embed)
  }
}
