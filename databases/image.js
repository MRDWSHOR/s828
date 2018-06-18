const cloudinary = require('cloudinary');
const Discord = require('discord.js');
const mysql = require('mysql');
var request = require('request').defaults({ encoding: null });
const bot = new Discord.Client();
cloudinary.config({ 
  cloud_name: 'murder-me', 
  api_key: '314125261996776', 
  api_secret: process.env.cloudinarySecret
});
const config = {
  host     : process.env.dbHost,
  port     : process.env.dbPort,
  user     : process.env.dbUser,
  password : process.env.dbPassword,
  database : process.env.dbName
};
const connection = mysql.createConnection(config)

function go(name2, userId, sender, channel) {
    channel.send("Loading profile for `" + name2 + "`").then(mymsg => {
    var authorURL = sender.displayAvatarURL();
    var created = new Date(sender.createdAt);
    var now = new Date();
    var oldname = String(name2);
    var name = encodeURIComponent(oldname);
    var fontsize;
    var y;
    if (oldname.length > 16) { fontsize = 50 - oldname.length; y=230; } else { fontsize = 40; y=240;}
    var newy = String(y)
    var dateCreated = encodeURIComponent(created.getDate() + "-" + created.getMonth() + "-" + created.getFullYear());
    var mins = now.getMinutes()
    var hours = now.getHours()
    if (String(hours).length === 1) {hours = "0" + String(hours)};
    if (String(mins).length === 1) {mins = "0" + String(mins);};
    var dateSent = encodeURIComponent(now.getDate() + "-" + now.getMonth() + "-" + now.getFullYear() + " | " +  hours + ":" + mins);
    var sqlstr = "SELECT Level, Choice, Messages, Credits, DateOfLastCredit, Bought FROM USERS WHERE UserId='" + String(userId) + "'";
    connection.query(sqlstr, function (err, result, fields) {
      if (err) throw err;
      if (result.length === 0) {
        mymsg.delete()
        channel.send("Unkown error. Try again later...")
      } else {
        
        var doflc = result[0]["DateOfLastCredit"];
        var level = result[0]["Level"];
        var choice = result[0]["Choice"];
        var credits = result[0]["Credits"];
        var messages = result[0]["Messages"];
        var bought = String(result[0]["Bought"].split(" ").sort((a, b) => a - b)).replace("[", "").replace("]", "").split(",").join("%252C%20");
        var collect;
        if ((now.getTime() - doflc) < 1000*60*60*23) {collect = "%20"} else {collect = "Collect%2520today%2527s%2520credits%2520with%2520%25credits%252E"};
        cloudinary.uploader.upload(authorURL, function(result) {
          var ID = result.public_id;
          var end;
               if (choice === "0") end = "/v1519797699/0.png"
          else if (choice === "1") end = "/v1519797715/1.png"
          else if (choice === "2") end = "/v1519797716/2.png"
          else if (choice === "3") end = "/v1519797715/3.png"
          else if (choice === "4") end = "/v1519797715/4.png"
          else if (choice === "5") end = "/v1519797715/5.png"
          var URL = "http://res.cloudinary.com/murder-me/image/upload/w_500,l_bg/w_100,g_north_west,x_40,y_50,l_" + ID + "/w_500,l_level/w_500/g_north_west,x_45,y_450,l_text:karma_15:Account%20Created%3A%20" + dateCreated + "/w_500,l_level/w_500/g_north_west,x_240,y_450,l_text:karma_15:Message%20sent%3A%20" + dateSent + "/g_north_west,co_rgb:ff4300,x_45,y_370,l_text:karma_30:XP%3A%20" + String(messages) + "/g_north_west,co_rgb:ff4300,x_45,y_400,l_text:karma_30:Backgrounds%3A%20" + String(bought) + "/g_north_west,x_45,y_340,co_rgb:ff4300,l_text:karma_30:Credits%3A%20" + String(credits) + "/g_north_west,x_200,y_365,co_rgb:ff4300,c_fit,w_490,l_text:karma_16:" + String(collect) + "/g_north_west,x_40,y_230,l_text:Roboto_70:" + String(level) + "/g_north_west,c_fit,w_400,x_110,y_" + newy + ",l_text:Roboto_" + String(fontsize) + ":" + name + end;
          request(URL, function(err, response, buffer) {
              mymsg.delete()
              channel.send("Profile for `" + name2 + "`: ",{ files: [{ attachment: buffer, name: 'My Profile.png' }] });
          });
        });
      }
      
    });
      
  });
  
};

module.exports = {
  edit: function(n, u, s, c) {go(n, u, s, c)}
}


bot.login(process.env.TOKEN);