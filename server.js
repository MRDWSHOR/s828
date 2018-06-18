const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log("✅" + Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);
//const { TOKEN, PREFIX, OWNERS, INVITE } = process.env;


const DBL = require("dblapi.js");
const dbl = new DBL(process.env.DBLToken);
const meant = require('meant')

function postStats(b) {
  var request2 = require('request')
  
  //discord.bots.org
  dbl.postStats(b.guilds.size);
  
  //botsfordiscord
  var options = {
    method: 'post',
    body: {count: b.guilds.size, server_count: b.guilds.size},
    json: true, // Use,If you are sending JSON data
    url: "https://botsfordiscord.com/api/v1/bots/323538617882640387/",
    headers: {Authorization: process.env.bfdToken}
  }
  request2(options, function (err, res, body) {})
  
  //terminal
  options = {
    method: 'post',
    body: {count: b.guilds.size, server_count: b.guilds.size},
    json: true, // Use,If you are sending JSON data
    url: "https://ls.terminal.ink/api/v1/bots/323538617882640387/",
    headers: {Authorization: process.env.TerminalToken}
  }
  request2(options, function (err, res, body) {})
  
  
  //botlist.space
  options = {
    method: 'post',
    body: {count: b.guilds.size, server_count: b.guilds.size},
    json: true, // Use,If you are sending JSON data
    url: "https://botlist.space/api/bots/323538617882640387/",
    headers: {Authorization: process.env.botlistSpaceToken}
  }
  request2(options, function (err, res, body) {})
  
  //discord.services
  options = {
    method: 'post',
    body: {count: b.guilds.size, server_count: b.guilds.size},
    json: true, // Use,If you are sending JSON data
    url: "https://discord.services/api/bots/323538617882640387/",
    headers: {Authorization: process.env.dservicesToken}
  }
  request2(options, function (err, res, body) {})
  
}



const { MessageEmbed } = require('discord.js');
const Servers = require('./databases/servers');
var fs = require('fs');

var queue = {};
var chessGames = {};

function isEmoji(str) {
    return /[^ -~]/.test(str) ? true : false;
};
function newGuild(i) {
  let embed = new MessageEmbed()
  .setTitle("New Guild`: " + i.name + "`")
  .addField("Members", i.memberCount)
  .addField("Channels", i.channels.size)
  .addField("Owner", i.owner.displayName)
  .addField("Total Servers", client.guilds.size)
  .addField("Total Users", client.users.size)
  .addField("Total Channels", client.channels.size)
  .setThumbnail(i.iconURL())
  .setTimestamp()
  .setColor("RANDOM")

  client.guilds.find(val => val.id === '331166980121821185').channels.find(val => val.id === '434678294739156993').send(embed)
}

function leftGuild(i) {
  let embed = new MessageEmbed()
  .setTitle("Left Guild`: " + i.name + "`")
  .addField("Members", i.memberCount)
  .addField("Channels", i.channels.size)
  .addField("Owner", i.owner.displayName)
  .addField("Total Servers", client.guilds.size)
  .addField("Total Users", client.users.size)
  .addField("Total Channels", client.channels.size)
  .setThumbnail(i.iconURL())
  .setTimestamp()
  .setColor("RANDOM")

  client.guilds.find(val => val.id === '331166980121821185').channels.find(val => val.id === '434678294739156993').send(embed)
}


function log(message) {
  let embed = new MessageEmbed()
      .setTitle("Command From: __" + message.author.tag + "__")
      .setColor("RANDOM")
      .setDescription(message.content)
      .setTimestamp()
      .setThumbnail(message.author.displayAvatarURL)
      .setFooter(message.client.user.username, message.client.user.displayAvatarURL())
    if (! message.channel.type === "dm") {
      Servers.getInvite(message.guild.id).then(i => {
        embed.addField("Server: __" + message.guild.name + "__", i)
        message.client.guilds.find(val => val.id === '331166980121821185').channels.find(val => val.id === '428050621376233472').send(embed)
      })
      invite()
    }
  client.guilds.find(val => val.id === '331166980121821185').channels.find(val => val.id === '428050621376233472').send(embed)
}

function invite(message) {
  Servers.checkCommand(message.guild.id).then( answer => {
    if (message.channel.type !== "dm") {
      let nm;
      if (!isEmoji(message.guild.name)) nm = message.guild.name
      else nm = "Non-English-name: " + String(message.guild.id)
      if (answer === undefined) {
          let ch = message.channel;
          let found = message.guild.channels.find(ch => ch.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE"))
            if (found === null || found === undefined) {
              Servers.add(nm, message.guild.id, message.guild.memberCount, "NOT ENOUGH PERMS")
            } else {
              found.createInvite({maxAge: 0}).then(inv => {
              Servers.add(nm, message.guild.id, message.guild.memberCount, inv.url)
            })
          }
        }
      }
    })
}
//end of functions
const sqlite = require('sqlite');
let TOKEN = process.env.TOKEN;
let PREFIX = process.env.PREFIX;
let OWNERS = "426706472248934400,297403616468140032";
let INVITE = "";
const path = require('path');
const { CommandoClient, SQLiteProvider } = require('discord.js-commando');

const client = new CommandoClient({
	commandPrefix: "%", 
	owner: OWNERS.split(','), 
	invite: INVITE,
	disableEveryone: true,
	unknownCommandResponse: false
//	disabledEvents: ['TYPING_START']
});




const activities = [{"text": client.guilds.size, "type": "WATCHING"}, {"text": "%help", "type": "LISTENING"}]
client.registry
	.registerDefaultTypes()
	.registerTypesIn(path.join(__dirname, 'types'))
	.registerGroups([
		['util', 'Utility'],
    ['info', 'Information'],
    ['commands', 'Command Manager'],
    ['fun', 'Fun'],
    ['music', 'Music'],
    ['level', 'Levelling'],
    ['game', 'Game'],
    ['mod', 'Moderation'],
    ['animal', 'Animal']
	]).registerDefaultCommands({
		help: false,
		ping: false,
    prefix: true,
    eval: true
//		commandState: false    
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.setProvider(
	sqlite.open(path.join(__dirname, 'prefixes.sqlite3')).then(db => new SQLiteProvider(db))
).catch(console.error);

client.on('ready', () => {
  postStats(client)
  console.log('--------------------------------------');
  console.log('Name    : ' + client.user.username + '#' + client.user.discriminator);
  console.log('ID      : ' + client.user.id);
  console.log('Servers : ' + client.guilds.size);
  console.log('Users   : ' + client.users.size);
  console.log('-------------------------------------');
	client.setInterval(() => {
		const activity = activities[Math.floor(Math.random() * activities.length)];
		client.user.setActivity(activity.text, { type: activity.type });
	}, 60000);
});



client.on('message', m => {
  if (!m.guild) return
  if (m.mentions.users.has(client.user) && m.content.replace(`<@${client.user.id}>`, "").replace(' ', '') == "") {
    m.channel.send(`My prefix is \`${m.guild.commandPrefix}\`. Use \`${m.guild.commandPrefix}prefix [x]\` to change it.`)
  }
})

client.on('disconnect', event => {
	console.error(`[DISCONNECT] Disconnected with code ${event.code}.`);
	process.exit(0);
});

client.on("commandPrefixChange", (guild, prefix) => {
  if (!guild) return;
  Servers.changePrefix(guild.id, prefix)
})

client.on('commandRun', (command, promise, message) => {
  console.log(`[COMMAND] Ran command ${command.groupID}:${command.memberName}.`)
  log(message)
});

client.on('error', err => console.error('[ERROR]', err));

client.on('warn', err => console.warn('[WARNING]', err));

client.on('commandError', (command, err) => console.error('[COMMAND ERROR]', command.name, err));

client.login(process.env.TOKEN);

client.on('unknownCommand', (command) => {
  if (!command.guild) return
  if (!command.content.startsWith(command.guild.commandPrefix)) return
  command.react('❌');
  Servers.checkDidYouMean(command.guild.id).then(dym => {
    if (dym !== true) return
    let msg = command.content.replace(command.guild.commandPrefix, '').split(' ')[0];
  
    let commands = [];
    let allFiles = [];
    var files = fs.readdirSync('commands/');
  
    for (let d = 0; d< files.length; d++) {
      let newFiles = fs.readdirSync('commands/' + files[d] + '/');
      for (let a = 0; a < newFiles.length; a++) {
        allFiles.push(`./commands/${files[d]}/${newFiles[a].replace('.js', '')}`)
      }
    }
    
    for (let i = 0; i < allFiles.length; i++) {
      let b = require(allFiles[i])
      let c = new b(client)
      commands.push(c.memberName)
      c.aliases.forEach(function(elem) {
        commands.push(elem)
      })
    }
    let ans = meant(String(msg).toLowerCase(), commands);
    if (Array.isArray(ans) && ans.length >= 2) command.channel.send(`Did you mean \`${command.guild.commandPrefix + ans[0]}\` or \`${command.guild.commandPrefix + ans[1]}\`?`)
    else if (ans !== null && ans.length === 1) command.channel.send("Did you mean `" + command.guild.commandPrefix + ans + "`?")
  })
  
})

process.on('unhandledRejection', err => {
	console.error('[FATAL] Unhandled Promise Rejection.', err);
	process.exit(1);
});

client.on('guildCreate', (i) => {
  console.log("+1:  " + i.name  )
  newGuild(i)
});

client.on('guildDelete', (i) => {
  console.log("-1:  " + i.name)
  leftGuild(i)
});


app.get("/info.json", (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    let data = {};
    data.servers = client.guilds.size;
    data.users = client.users.size;
    data.commands = client.registry.commands.size;
    data.channels = client.channels.size
  res.send(data)
})

app.get("/commands.json", (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed
  let data = [];
  let allFiles = [];
  var files = fs.readdirSync('commands/');
  
  for (let d = 0; d< files.length; d++) {
    let newFiles = fs.readdirSync('commands/' + files[d] + '/');
    for (let a = 0; a < newFiles.length; a++) {
      allFiles.push(`./commands/${files[d]}/${newFiles[a].replace('.js', '')}`)
    }
  }
  
  for (let i = 0; i < allFiles.length; i++) {
    let b = require(allFiles[i])
    let c = new b(client)
    let name = c.name
    let desc = c.description
    let section = allFiles[i].split('/')[2]
    let n = {name: name, desc: desc, group: section}
    data.push(n)
  }
  res.send(data)
})

app.get("/queue.json", (req, res, next) => {
  res.send(queue)
})

app.get('/upload.json', (req, res, next) => {
  queue = JSON.parse(req.query.new)
  res.send(queue)
})


app.get("/chess.json", (req, res, next) => {
  res.send(chessGames)
})

app.get('/cupload.json', (req, res, next) => {
  chessGames = JSON.parse(req.query.new)
  res.send(chessGames)
})



