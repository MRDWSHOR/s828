const mysql = require('mysql');
const Discord = require('discord.js');
const bot = new Discord.Client();
const config = {
  host     : process.env.dbHost,
  port     : process.env.dbPort,
  user     : process.env.dbUser,
  password : process.env.dbPassword,
  database : process.env.dbName
};

const connection = mysql.createConnection(config)

function setup() {
  let sqlstr = `CREATE TABLE USERS (
    Name varchar(255),
    UserID varchar(255),
    Messages int,
    Credits int,
    Choice varchar(20),
    Level int,
    DateOfLastCredit varchar(255),
    Bought varchar(255)
);`;
    connection.query(sqlstr, function (err, result, fields) {
      if (err) throw err;
      console.log("Created Table!")
    });
};

function addUser(name, userId) {
    var r;
    connection.query("SELECT * FROM USERS WHERE UserID='" + userId +"'", function (error, results, fields) {
      if (error) throw error;
      r = results.length
      if (r === 0) addUser2(name, userId)
    });
};

function addUser2(name, userId) {
    var values = [String(name), String(userId), 1, 0, 0, " 0 ", 0, 0, " 0 "]
    var post  = {Name: values[0], UserID: values[1], Messages: values[2], Credits: values[3], Choice: values[4], Level: values[5], DateOfLastCredit: values[6], Bought: values[7]};
    var query = connection.query("INSERT INTO USERS SET ?", post, function (err, results, fields) {
      if (err) throw err
    });
};

function deleteAllData() {
  var query = connection.query("DELETE FROM USERS;", function (error, results, fields) {
    if (error) throw error;
    });
  var query = connection.query("DROP TABLE USERS;", function (error, results, fields) {
    if (error) throw error;
    console.log("Gone Forever...")
    });
};

function disableLevelling(name, userId, channel, prefix) {
  var query = "SELECT Levelling FROM USERS WHERE UserID='" + String(userId) + "'"
  connection.query(query, function(err, results, fields) {
    if (err) throw err;
    if (results.length === 0) {return channel.send("Unkown Error. Try again later...")};
    if (results[0]["Levelling"] === 1) {return channel.send("You already have levelling disabled (for you). Use `" + prefix + "allow` to enable it.")}
    var query2 = "UPDATE USERS SET Levelling='1' WHERE UserID='" + String(userId) + "'"
    connection.query(query2, function(err, results, fields) {
      if (err) throw err;
      channel.send("The levelling system has been disabled for `" + name + "`. To re-enable use `" + prefix + "allow`.")
    });
  });
};

function enableLevelling(name, userId, channel, prefix) {
  var query = "SELECT Levelling FROM USERS WHERE UserID='" + String(userId) + "'"
  connection.query(query, function(err, results, fields) {
    if (err) throw err;
    if (results.length === 0) {return channel.send("Unkown Error. Try again later...")};
    if (results[0]["Levelling"] === 0) {return channel.send("You already have levelling enabled (for you). Use `" + prefix + "disallow` to disable it.")}
    var query2 = "UPDATE USERS SET Levelling='0' WHERE UserID='" + String(userId) + "'"
    connection.query(query2, function(err, results, fields) {
      if (err) throw err;
      channel.send("The levelling system has been enabled for `" + name + "`. To disable use `" + prefix + "disallow`.")
    })
  })
};

var checkForLevelling = function(name, userId) {
  return new Promise(function(resolve, reject) {
    var query = "SELECT Levelling FROM USERS WHERE UserID='" + String(userId) + "'"
    connection.query(query, function(err, results, fields) {
      if (err) reject(err);
      if (results.length === 0) {resolve(undefined)}
      else resolve(parseInt(results[0]["Levelling"]))
    });
  });
}

function changeChoice(name, userId, newChoice, channel, prefix) {
  if (parseInt(newChoice) > 5 || parseInt(newChoice) < 0 ) {channel.send("Check syntax.");return;}
  var query = "SELECT Bought FROM USERS WHERE UserID='" + userId + "'";
  connection.query(query, function (err, results, fields) {
      if (results.length === 0) {channel.send("You do not have the item. Buy it with `" + prefix + "buy " + String(newChoice) + "`.");return;}
      if (!results[0]["Bought"].split(" ").includes(String(newChoice))) {channel.send("You do not have the item. Buy it with `" + prefix + "buy " + String(newChoice) + "`.");return;}
      var query = "UPDATE USERS SET Choice='" + String(newChoice) + "' WHERE UserID='" + userId + "'";
      connection.query(query, function (err, results, fields) {
        channel.send("You have changed your choice to `" + newChoice + "`.")
      })
  });
}

function checkLevelUp(userId, sender, channel) {
  var query = "SELECT Messages FROM USERS WHERE UserID='" + userId + "'"
  connection.query(query, function (err, results, fields) {
    if (results === undefined || results.length === 0) return
    var msgs = results[0]["Messages"]
    var levelUp = false
    if (msgs === 10)  levelUp = 1
    if (msgs === 50)  levelUp = 2
    if (msgs === 100)  levelUp = 3
    if (msgs === 500)  levelUp = 4
    if (msgs === 1000)  levelUp = 5
    if (msgs === 2000)  levelUp = 6
    if (msgs === 4000)  levelUp = 7
    if (msgs === 6000)  levelUp = 8
    if (msgs === 8000)  levelUp = 9
    if (msgs === 10000)  levelUp = 10
    if (!levelUp === false) {
      let send = sender + " has levlled up! You are now level `" + String(levelUp) + "`."
      var query = connection.query("UPDATE `USERS` SET `Level` = " + levelUp + " WHERE `UserID` = '" + userId + "'", function (err, results, fields) {
        if (err) throw err;
        channel.send(send);
      });
    };
  });
};

function getLevel(userId, sender, channel) {
  var query = "SELECT Level FROM USERS WHERE UserID='" + userId + "'"
  connection.query(query, function (err, results, fields) {
    if (results.length === 0) {
      let send = "`" + sender + "` is level `0`."
      console.log(send);
      return
    } else {
      let send = "`" + sender + "` is level `" + String(results[0]["Level"]) + "`."
      channel.send(send)
    };
  });
};

function getXp(userId, sender, channel) {
  var query = "SELECT Messages FROM USERS WHERE UserID='" + userId + "'"
  connection.query(query, function (err, results, fields) {
    if (results.length === 0) {
      let send = "`" + sender + "` has `0` XP."
      console.log(send);
      return
    } else {
      let send = "`" + sender + "` has `" + String(results[0]["Messages"]) + "` XP."
      channel.send(send)
    };
  });
};

function addMessages(name, userId, sender, channel) {
  addUser(name, userId);
    var query = connection.query("UPDATE `USERS` SET `Messages` = `Messages` + 1 WHERE `UserID` = '" + userId + "'", function (err, results, fields) {
        if (err) throw err;
        checkLevelUp(userId, sender, channel)
      });
};

function changeName(newname, userId) {
  addUser(newname, userId);
  let q = "UPDATE USERS SET Name= ? WHERE UserID= ? "
    var query = connection.query(q, [newname, userId], function (err, results, fields) {
        if (err) throw err; 
      });
};


function getProfile(name, userId, url, channel, prefix) {
  addUser(name, userId);
  var query = "SELECT Credits, Messages, DateOfLastCredit, Level FROM USERS WHERE UserID='" + userId +"'";
  connection.query(query, function(err, results, fields) {
    if (err) throw err;
    var credits;
    var level;
    var messages;
    var doflc;
    if (results.length === 0) {
      level = 0
      messages = 1
      credits = 0
      doflc = 0
    } else {
      level = results[0]["Level"];
      messages = results[0]["Messages"];
      credits = results[0]["Credits"];
      doflc = results[0]["DateOfLastCredit"]
    }
    let now = new Date();
    if ((now.getTime() - doflc) < 1000*60*60*23) {
      const embed = new Discord.RichEmbed()
      .setTitle("Profile card for " + name)
      .setDescription("_ _")
      .setThumbnail(url)
      .setFooter(bot.user.username, bot.user.displayAvatarURL)
      .setColor(0x80ff00)
      .addField("Level: `" + String(level) + "`", '_ _')
      .addField("Points: `" + String(messages) + "`", '_ _')
      .addField("Credits: `" + String(credits) + "`", '_ _')
      .setTimestamp();
      channel.send(embed);
    } else {
      const embed = new Discord.RichEmbed()
      .setTitle("Profile card for " + name)
      .setDescription("_ _")
      .setThumbnail(url)
      .setFooter(bot.user.username, bot.user.displayAvatarURL)
      .setColor(0x80ff00)
      .addField("Level: `" + String(level) + "`", '_ _')
      .addField("Points: `" + String(messages) + "`", '_ _')
      .addField("Credits: `" + String(credits) + "`", "Collect today's credits using `" + prefix + "credits`.")
      .setTimestamp();
      channel.send(embed);    
    }
  });
};

function manualSql(sqlstr, channel) {
  connection.query(sqlstr, function(err, results, fields) {
    if (err) channel.send("Error: ```fix\n" + err.message + "```")
    else {
      if (String(sqlstr.split(" ")[1]) === "SELECT") {
        let r = JSON.parse(JSON.stringify(results));
        let toSend = "```fix\n"
        for (var i = 0; i < results.length; i++) {
          for (var key in results[i]) {
            toSend = toSend + String(key) + ": " + String(results[i][key]) + "\n"
          }
          toSend = toSend + "\n"
        }
        toSend = toSend + "```"
        if (toSend.length >= 1999) channel.send("Retrieved " + results.length + " results.")
        channel.send("Results: " + toSend)
      } else {
        (channel.send("Success: `" + sqlstr + "`"))
      }
    }
  })
}


function addVote(name, userId, channel, number=150) {
  let now = new Date();
  addUser(name, userId);
  var query = "SELECT DateOfLastVote FROM USERS WHERE UserID='" + userId +"'";
  connection.query(query, function(err, results, fields) {
    if (err) throw err;
    if (results.length === 0) {
      channel.send("Unkown Error. Try again later.")
      return
    };
    var doflc = results[0]["DateOfLastVote"];
    if ((now.getTime() - doflc) < 1000*60*60*23) {
      let difference = now.getTime() - doflc
      let one_hour = 1000*60*60;
      channel.send("You have already collected today's upvoting credits. Come back in `" + Math.round(24-Math.round((difference)/one_hour)) + "` hours for more.")
      return
    };
    var query = "UPDATE `USERS` SET `Credits` = `Credits` + " + number + " WHERE `UserID` = '" + userId + "'"
    connection.query(query, function (err, results, fields) {
      if (err) throw err;
      var query = "UPDATE `USERS` SET `DateOfLastVote` = " + now.getTime() + " WHERE `UserID` = '" + userId + "'"
      connection.query(query, function (err, results, fields) {
        if (err) throw err;
        var query = "SELECT Credits FROM USERS WHERE UserID='" + userId +"'";
        connection.query(query, function(err, results, fields) {
          if (err) throw err
          let c = results[0]["Credits"]
          channel.send("You recieved " + number + " credits for upvoting! You have `" + c + "` credits!  :credit_card: :money_with_wings: :money_with_wings:")
        });
      });
    });
  });
};

function addCredits(name, userId, channel, prefix, number=100) {
  let now = new Date();
  addUser(name, userId);
  var query = "SELECT DateOfLastCredit FROM USERS WHERE UserID='" + userId + "'";
  connection.query(query, function(err, results, fields) {
    if (err) throw err;
    if (results.length === 0) {
      channel.send("Unkown Error. Try again later.")
      return
    };
    var doflc = results[0]["DateOfLastCredit"];
    if ((now.getTime() - doflc) < 1000*60*60*23) {
      let difference = now.getTime() - doflc
      let one_hour = 1000*60*60;
      channel.send("You have already collected today's credits. Come back in `" + Math.round(24-Math.round((difference)/one_hour)) + "` hours for more.")
      return
    };
    var query = "UPDATE `USERS` SET `Credits` = `Credits` + " + number + " WHERE `UserID` = '" + userId + "'"
    connection.query(query, function (err, results, fields) {
      if (err) throw err;
      var query = "UPDATE `USERS` SET `DateOfLastCredit` = " + now.getTime() + " WHERE `UserID` = '" + userId + "'"
      connection.query(query, function (err, results, fields) {
        if (err) throw err;
        var query = "SELECT Credits FROM USERS WHERE UserID='" + userId +"'";
        connection.query(query, function(err, results, fields) {
          if (err) throw err
          let c = results[0]["Credits"]
          channel.send("You recieved " + number + " credits! You have `" + c + "` credits!  :credit_card: :money_with_wings: :money_with_wings:\n Get more credits by upvoting SankOBot. Try (`" + prefix + "vote`)")
        });
      });
    });
  });
};


function buyBg(name, userId, toBuyOne, channel, prefix) {
  addUser(name, userId);
  var query = "SELECT Bought, Credits FROM USERS WHERE UserID='" + userId +"'";
  connection.query(query, function(err, results, fields) {
    if (err) throw err
    if (results.length === 0) {channel.send("Unkown Error. Try again later."); return;}
    var bought = String(results[0]["Bought"]);
    var creds = parseInt(results[0]["Credits"]);
    var toBuy = parseInt(toBuyOne);
    //Checking for da money
    if (toBuy === 1  &&  creds < 500) { channel.send("You need `" + String(500 - creds) + "` more credits. You have `" + String(creds) + "` credits."); return};
    if (toBuy === 2  &&  creds < 1000) { channel.send("You need `" + String(1000 - creds) + "` more credits. You have `" + String(creds) + "` credits."); return};
    if (toBuy === 3  &&  creds < 1500) { channel.send("You need `" + String(1500 - creds) + "` more credits. You have `" + String(creds) + "` credits."); return};
    if (toBuy === 4  &&  creds < 2000) { channel.send("You need `" + String(2000 - creds) + "` more credits. You have `" + String(creds) + "` credits."); return};
    if (toBuy === 5  &&  creds < 2500) { channel.send("You need `" + String(2500 - creds) + "` more credits. You have `" + String(creds) + "` credits."); return};
    if (toBuy > 5 || toBuy === NaN) {channel.send("Check the syntax."); return}
    if (bought.split(" ").includes(String(toBuy))) { channel.send("You already have this item. Use `" + prefix + "choose " + String(toBuy) + "` to equip."); return}
    var query = "UPDATE USERS SET Bought ='" + bought + " " + String(toBuy) + "', Choice='" + toBuy +"', Credits='" + String(parseInt(creds) - parseInt(toBuy*500)) + "' WHERE UserID='" + userId +"'";
    connection.query(query, function(err, results, fields) {
      if (err) throw err;
      channel.send("You have bought the item. Use `" + prefix + "profile` to check.")
    });
  });
};

module.exports = {
  setup: function() { setup() },
  addUser: function(name, userid) { addUser(name, userid) },
  addMessage: function(name, userId, sender, channel) { addMessages(name, userId, sender, channel) },
  addCredits: function(name, userId, channel, prefix, number=100) { return addCredits(name, userId, channel, prefix, number) },
  addVote: function(name, userId, channel, number=150) { return addVote(name, userId, channel, number) },
  delete: function() { deleteAllData() },
  level: function(userId, sender, channel) { getLevel(userId, sender, channel) },
  xp: function(userId, sender, channel) { getXp(userId, sender, channel) },
  profile: function(name, userId, url, channel, prefix) { getProfile(name, userId, url, channel, prefix)},
  buy: function(n, u, tb, c, p) {buyBg(n, u, tb, c, p)},
  choose: function(name, userId, newChoice, channel, prefix) {changeChoice(name, userId, newChoice, channel, prefix)},
  sql: function(sqlstr, channel) {manualSql(sqlstr, channel)},
  enable: function(n, u, c, prefix) {enableLevelling(n, u, c, prefix)},
  disable: function(n, u, c, prefix) {disableLevelling(n, u, c, prefix)},
  checkLevelling: function(n, u, c) {return checkForLevelling(n, u)},
  changeName: function(n, u) {changeName(n, u)}
}


bot.login(process.env.TOKEN);