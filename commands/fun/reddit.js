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
			name: 'reddit',
			aliases: ['subreddit'],
			group: 'fun',
			memberName: 'reddit',
			description: 'Get a random post from a specified subreddit',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    
    let msgSplit = message.content.replace("/r/", "").replace("r/", "").split(' ')
    if (msgSplit.length < 2) {
      message.channel.send('Check syntax: `' + prefix + 'reddit [custom subreddit]');
    } else {
    let chosenSubreddit = String(msgSplit[1]);
    async function sendURL(titles) {
      if (titles !== "Promise chain rejection: Cannot read property 'url' of undefined.") {
        message.channel.send(titles);
      } else {
        message.channel.send("Error. Could not find the subreddt `" + chosenSubreddit + "`.");
      }
    }
    let max = 20;
    let min = 0;
    let randomnumber = Math.floor(Math.random()*(max-min+1)+min);
    r.getSubreddit(chosenSubreddit).fetch().then(data => {
      if (data.over18 && !message.channel.nsfw) {
        return message.channel.send("This is an NSFW marked subreddit. You can only use this command in NSFW channels.")
      } else {
        r.getSubreddit(chosenSubreddit).getHot()[parseInt(randomnumber)]['url'].then(sendURL)
          .catch(error => {sendURL(error.message)});
      }
                                                 
    })
    
    }
  };
}
