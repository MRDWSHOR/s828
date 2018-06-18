const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class IdCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'invite',
			aliases: ['invites', 'inviteme'],
			group: 'info',
			memberName: 'invite',
			description: 'Invite the bot to another server',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    let e = new MessageEmbed()
    .setTitle("Invite me to your server")
    .setColor(0xffee00) 
    .setDescription("https://discordapp.com/oauth2/authorize?client_id=323538617882640387&scope=bot&permissions=201587825")
    message.channel.send(e);
  };
}
