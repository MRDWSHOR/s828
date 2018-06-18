const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
var request = require('request').defaults({ encoding: null });

module.exports = class WeatherCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'weather',
			aliases: ['climate', 'temperature'],
			group: 'info',
			memberName: 'weather',
			description: 'Get the weather for a certain place.',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    
    let split = message.content.split(" ")
    if (split.length === 1) {
      return message.channel.send("Check syntax: `" + prefix + "weather [city name]`")}
    
    split.shift()
    let city = split.join(' ').toLowerCase()
    let url = "https://www.metaweather.com/api/location/search/?query=" + city
    request({url: url,json: true}, function (error, response, body) {
      if (error) throw (error);
      if (body.length === 0) {
        let url2 = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + process.env.WEATHER_KEY;
        request({url: url2,json: true}, function (error, response, bodyTry) {
          if (bodyTry["cod"] !== "200") {
            return message.channel.send("No cities found with the name `" + city.replace("%20", " ") + "`.")
          }
          else {
            let foundData = bodyTry
            let embed = new MessageEmbed()
            .setTitle("Weather for __" + bodyTry["name"] + "__")
            .setColor(0xf4d742)
            .addField("Current weather", foundData["weather"][0]["description"].capitalize())
            .addField("Wind", "Speed: " + Math.round(foundData["wind"]["speed"] * 2.23694) + "mph\nDirection: " + foundData["wind"]["deg"] + "°")
            .addField("Temperature", "Minimum: " + Math.round(foundData["main"]["temp_min"] - 273.15) + "°C\nMaximum: " + Math.round(foundData["main"]["temp_max"] - 273.15)  + "°C\n**Current: " + Math.round(foundData["main"]["temp"] - 273.15)  + "°C**")
            .addField("Humidity", foundData["main"]["humidity"] + "%")
            message.channel.send(embed)
          }
        })
      }//
      else {
        let woeid = body[0]["woeid"]
        let newUrl = "https://www.metaweather.com/api/location/" + woeid + "/"
        request({url: newUrl,json: true}, function (error, response, body2) {
          let foundData = body2["consolidated_weather"][0]
          let embed = new MessageEmbed()
          .setTitle("Weather for __" + body[0]["title"] + "__")
          .setColor(0xf4d742)
          .addField("Current weather", foundData["weather_state_name"])
          .addField("Wind", "Speed: " + Math.round(foundData["wind_speed"] * 2.23694) + "mph\nDirection: " + foundData["wind_direction_compass"])
          .addField("Temperature", "Minimum: " + Math.round(foundData["min_temp"]) + "°C\nMaximum: " + Math.round(foundData["max_temp"]) + "°C\n**Current: " + Math.round(foundData["the_temp"]) + "°C**")
          .addField("Humidity", foundData["humidity"] + "%")
          .setFooter(newUrl)
          message.channel.send(embed)
        });
      }
    });
  }
}
