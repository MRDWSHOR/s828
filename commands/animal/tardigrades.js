const Command = require('../../structures/Command');
const TDGs = require('../../arrays/tardigrades.js');
const { stripIndents } = require('common-tags');

module.exports = class TardigradeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tardigrades',
			aliases: ['tardigrade', 'water-bear', 'waterbears', 'waterbear', 'water-bears'],
			group: 'animal',
			memberName: 'tardigrades',
			description: 'Learn about tardigrades with some random tardigrade facts.',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    message.channel.send(TDGs.facts[Math.floor(Math.random() * TDGs.facts.length)])
  }
}
