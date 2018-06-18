const Command = require('../../structures/Command');

const { MessageEmbed } = require('discord.js');

const snoowrap = require('snoowrap');
const r = new snoowrap({
  userAgent: process.env.userAgent,
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  refreshToken: process.env.refreshToken
});


module.exports = class MemeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'meme',
			aliases: [],
			group: 'fun',
			memberName: 'meme',
			description: 'Quality random memes',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    let max = 20;
    let min = 0;
    let randomnumber = Math.floor(Math.random()*(max-min+1)+min);
    function getMeme() {
      r.getSubreddit('dankmemes').getHot()[parseInt(randomnumber)]['url'].then( titles => {
        if (titles.endsWith(".jpg") || titles.endsWith(".png") || titles.endsWith(".gif")) {
          let e = new MessageEmbed().setImage(titles).setColor(0xffee00).setTimestamp()
          message.channel.send(e)
        } else {getMeme(); console.log("Hm")};
      })
    }
    getMeme();
  };
}
