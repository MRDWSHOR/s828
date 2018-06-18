const Command = require('../../structures/Command');
var moment = require('moment');

module.exports = class SinceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'since',
			aliases: ['howlong'],
			group: 'info',
			memberName: 'since',
			description: 'Check how long you have been in the server for.',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) return message.channel.send('This command is only available in a server.')
    else prefix = message.guild.commandPrefix 
    let now = new Date();
    let then = message.member.joinedAt;
    let time = `${moment(now).diff(moment(then), 'days')} days`
    message.channel.send(`You joined \`${message.guild.name}\`, \`${time}\` ago.`)
  }
}
  
