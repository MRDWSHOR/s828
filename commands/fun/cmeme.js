const Command = require('../../structures/Command');

const { MessageEmbed } = require('discord.js');

const snoowrap = require('snoowrap');
const r = new snoowrap({
  userAgent: process.env.userAgent,
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  refreshToken: process.env.refreshToken
});


module.exports = class CmemeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cmeme',
			aliases: [],
			group: 'fun',
			memberName: 'cmeme',
			description: 'One message - 20 memes (A changing meme that changes)',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    
    if (!message.guild.permissionsIn(message.channel).has("ATTACH_FILES")) return message.channel.send("I need permissions to `Attach files` for his command.")
    let errorCode = 0;
    let count = 0
    r.getSubreddit('dankmemes').getHot().then(memes => {
      message.channel.send('Loading your memes...').then(message => {
        let loadingMsg = message
        
        async function sendURL2 (titles, num) {
          if (loadingMsg.content !== null) {
            loadingMsg.edit(titles)
              .catch(error => { console.log('Error: ', error.message);  errorCode=1;  });
          }
        }
        function loopMemeGenerator() {
          count += 1
          let max = memes.length;
          let min = 0;
          let randomnumber = Math.floor(Math.random()*max);
          let t = memes[randomnumber]['url']
          memes.splice(randomnumber, 1)
          sendURL2(t, randomnumber)
          if (errorCode !== 0) {
            message.channel.send('Error on `' + prefix + 'cmeme` command.')
          };
        if (count <= 20 && errorCode === 0) setTimeout(loopMemeGenerator, 10000)
        };
        loopMemeGenerator()
        })
      })
    };
}
