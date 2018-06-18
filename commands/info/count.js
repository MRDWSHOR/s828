const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class CountCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'count',
			aliases: ['servercount', 'membercount', 'members', 'guildcount', 'server-count', 'guild-count', 'member-count', 'member'],
			group: 'info',
			memberName: 'count',
			description: 'Check how many members the server has',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    message.guild.members.fetch()
      .then(g=>{
      let total = g.size;
      let humans = g.filter(m => !m.user.bot).size;
      let bots = total - humans
      let e = new MessageEmbed()
        .setTitle(message.guild.name)
        .setDescription('Member summary')
        .setColor(0xffee00)
        .setTimestamp()
        .addField('Total Members', total)
        .addField('Human Members', humans)
        .addField('Bot Members', bots)
      message.channel.send(e)
    })
  }
}
