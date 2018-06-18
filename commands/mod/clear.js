const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class ClearCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'clear',
			aliases: ['purge'],
			group: 'mod',
			memberName: 'clear',
			description: "Clear a certain number of messages from the channel",
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) return message.channel.send('This command is only available in a server.')
    else prefix = message.guild.commandPrefix 
    
    if (! message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) 
      message.channel.send("I do not have enough permissions to clear messages ")
      let args = message.content.split(' ')
      async function purge() {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) 
          message.channel.send('You need the \`Manage Messages\` permission to use this command.');
        if (isNaN(args[1])) {
          if (args[1] === "all") {
            message.channel.messages.deleteAll()
            message.author.send('Successfully cleared `' + message.channel.messages.size + ' messages` from `' + message.guild.name + '`.\n**NB**: It can only clear messages less than 100 days old with `' + prefix + 'clear all`')
          }
          else message.channel.send('Please use a number as your argument. \n Usage: `' + prefix + 'clear [x]`');
          return;
        } else {
          if (parseInt(args[1]) > 100) return message.channel.send('You can only clear up to 100 messages at a time.')
          message.channel.bulkDelete(args[1], true)
            .then(m => message.author.send('Successfully cleared `' + m.size + ' messages` from `' + message.guild.name + '` '))
            .catch(error => {
            message.channel.send(`Error: ${error}`)
          });
        }
      } purge()
  };
}
