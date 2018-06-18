const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class IdCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'id',
			aliases: ['userid', 'user-id'],
			group: 'info',
			memberName: 'id',
			description: 'Get the userid of a mentioned user or yourself',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
		if (message.mentions.users.size > 0) {
      message.channel.send(":id: `" + message.mentions.users.first().username +"`'s user id is: **`" + message.mentions.users.first().id + "`**.")
    } else {
      message.channel.send(":id: Your user id is: `" + message.author.id + "`.")
    }
};
}
