const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NewsApiKey);

module.exports = class NewsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'news',
			aliases: [],
			group: 'info',
			memberName: 'news',
			description: 'Get top global news stories',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    newsapi.v2.topHeadlines({
      language: 'en',
      country: 'us'
    }).then(response => {
      let articles = response.articles.slice(0, 5)
      let emb = new MessageEmbed()
        .setTitle("News articles")
      for (let i = 0; i < articles.length; i++) {
        let auth = articles[i].author || "Unkown Author"
        let title = articles[i].title || ""
        let desc = articles[i].description || "No description"
        let url = articles[i].url || "http://www.bbc.co.uk/news"
        emb.addField("__" + auth + "__: " + title, "[" + desc + "](" + url + ")")
      }
      message.channel.send(emb)
    })
  };
}
