const Command = require('../../structures/Command');
const figlet = require('figlet');

module.exports = class AsciiCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ascii',
			aliases: ['ascii-art', 'asciiart'],
			group: 'fun',
			memberName: 'ascii',
			description: 'Make text into ascii art',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    let msg = message.content
    
    if (message.mentions.users.size >= 1) {
      message.channel.send('You cannot tag in ascii.')
      return
    }
    let args = msg.split(' ')
    args.shift()
    args = args.join(' ')
    
    figlet(args, function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    async function ascii() {
      message.channel.send('```fix\n' + data + '```');
    }ascii();});
  };
}
