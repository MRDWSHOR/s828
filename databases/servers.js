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
  let sqlstr = `CREATE TABLE SERVERS (Name varchar(255), ServerID varchar(255), LastCommand int, InviteLink varchar(255), Members varchar(255), Levelling int, DidYouMean int, Welcome varchar(255), WelcomeMessage varchar(255), Prefix varchar(255));`;
    connection.query(sqlstr, function (err, result, fields) {
      if (err) throw err;
      console.log("Created Table!")
    });
};

function addServer(name, serverid, members, inv) {
  let newname = name.replace("'", "`").replace('"', '`')
  connection.query("SELECT * FROM SERVERS WHERE ServerID='" + serverid + "'", function (error, results, fields) {
      if (error) throw error;
      if (results.length === 0) {
        let q = "INSERT INTO SERVERS (Name, ServerID, LastCommand, Members, InviteLink) VALUES('" + newname + "', '" + serverid + "', '0', '" + members +"', '" + inv + "');"
        connection.query(q, function(err, result, fields) {
          if (err) throw err;
        })
      }
    });
};

var getPrefix = function(serverid) {
  return new Promise(function(resolve, reject) {
  connection.query("SELECT Prefix FROM SERVERS WHERE ServerID='" + serverid + "'", function (error, results, fields) {
      if (error) throw error;
      else if (results.length === 0) resolve("%")
      else if (results[0].Prefix === '%') resolve('%')
      else {
        resolve(decodeURIComponent(results[0].Prefix))
      }
    });
  })
};


var getInvite = function getInvite(serverid) {
  return new Promise(function(resolve, reject) {
  connection.query("SELECT InviteLink FROM SERVERS WHERE ServerID='" + serverid + "'", function (error, results, fields) {
      if (error) throw error;
      else if (results.length === 0) resolve("No invite link")
      else resolve(results[0].InviteLink)
    });
  })
}

var checkCommand = function(serverid) {
  let now = new Date();
  let cd = parseInt(process.env.cooldown)
  return new Promise(function(resolve, reject) {
  connection.query("SELECT LastCommand FROM SERVERS WHERE ServerID='" + serverid + "'", function(err, result, fields) {
    if (err) throw err;
    if (result.length === 0) {resolve(undefined)}
    else if ((now.getTime() - result[0]["LastCommand"]) <= 1000*cd) {resolve(false)}
    else if ((now.getTime() - result[0]["LastCommand"]) > 1000*cd) {
      connection.query("UPDATE SERVERS SET LastCommand='" + now.getTime() + "' WHERE ServerID='" + serverid + "'", function(err, result, fields) {
        if (err) throw err;
        else resolve(true)
      })
    }
  })
  })
};


var checkDidYouMean = function(serverid) {
  return new Promise(function(resolve, reject) {
  connection.query("SELECT DidYouMean FROM SERVERS WHERE ServerID='" + serverid + "'", function(err, result, fields) {
    if (err) throw err;
    if (result.length === 0) {return resolve(undefined)}
    if (result[0].DidYouMean == 0) return resolve (false)
    else if (result[0].DidYouMean == 1) return resolve(true)
    else resolve (undefined)
  })
  })
};


var checkWelcome = function(serverid) {
  return new Promise(function(resolve, reject) {
  connection.query("SELECT Welcome, WelcomeMessage FROM SERVERS WHERE ServerID='" + serverid + "'", function(err, result, fields) {
    if (err) throw err;
    if (result.length === 0) {resolve(undefined)}
    else resolve([result[0].Welcome, result[0].WelcomeMessage])
  })
  })
};


var changeWelcome = function(serverid, channelid, msg) {
  return new Promise(function(resolve, reject) {
  connection.query("UPDATE SERVERS SET Welcome='" + channelid + "', WelcomeMessage=? WHERE ServerID='" + serverid +"'", msg, function(err, result, fields) {
      if (!err) resolve(true)
      else console.log(err)
    })
  })
};


var changeDidYouMean = function(serverid) {
  return new Promise(function(resolve, reject) {
  connection.query("SELECT DidYouMean FROM SERVERS WHERE ServerID='" + serverid + "'", function(err, result, fields) {
    if (err) throw err;
    if (result.length === 0) resolve(undefined)
    if (result[0].DidYouMean == 0) {
      connection.query("UPDATE SERVERS SET DidYouMean='1' WHERE ServerID='" + serverid +"'", function(err, result, fields) {
        if (!err) resolve(true)
        else console.log(err)
      })
    }
    else if (result[0].DidYouMean == 1) {
      connection.query("UPDATE SERVERS SET DidYouMean='0' WHERE ServerID='" + serverid +"'", function(err, result, fields) {
        if (!err) resolve(false)
        else console.log(err)
      })
    }
    else resolve (undefined)
  })
  })
};


var enable = function(serverid) {
  let now = new Date();
  return new Promise(function(resolve, reject) {
  connection.query("UPDATE SERVERS SET Levelling='0' WHERE ServerID='" + serverid + "'", function(err, result, fields) {
        if (err) throw err;
        else resolve(true)
  })
  })
}


var changePrefix = function(serverid, newPrefix) {
  let now = new Date();
  return new Promise(function(resolve, reject) {
  connection.query("UPDATE SERVERS SET Prefix='" + encodeURIComponent(newPrefix) + "' WHERE ServerID='" + serverid + "'", function(err, result, fields) {
        if (err) throw err;
        else resolve(true)
  })
  })
}

var disable = function(serverid) {
  let now = new Date();
  return new Promise(function(resolve, reject) {
  connection.query("UPDATE SERVERS SET Levelling='1' WHERE ServerID='" + serverid + "'", function(err, result, fields) {
    if (err) throw err;
    else resolve(true)
  })
  })
}



var checkLevelling = function(serverid) {
  let now = new Date();
  return new Promise(function(resolve, reject) {
  connection.query("SELECT Levelling FROM SERVERS WHERE ServerID='" + serverid + "'", function(err, result, fields) {
    if (err) throw err;
    if (result.length == 0) resolve(true)
    else if (result[0]["Levelling"] == 0) resolve(true)
    else if (result[0]["Levelling"] == 1) resolve(false)
    else resolve(null)
  })
  })
}


module.exports = {
  add: function(n, i, m, inv) {addServer(n, i, m, inv);},
  checkCommand: function(id) {return checkCommand(id)},
  enable: function(id) {return enable(id)},
  disable: function(id) {return disable(id)},
  checkLevelling: function(id) {return checkLevelling(id)},
  getInvite: function(i) {return getInvite(i)},
  getPrefix: function(i) {return getPrefix(i)},
  checkDidYouMean: function(id) {return checkDidYouMean(id)},
  changeDidYouMean: function(id) {return changeDidYouMean(id)},
  checkWelcome: function(id) {return checkWelcome(id)},
  changeWelcome: function(id, i2, m) {return changeWelcome(id, i2, m)},
  changePrefix: function(a, v) {return changePrefix(a, v)}
}