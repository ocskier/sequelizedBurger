// Set up MySQL connection.
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "mgs0iaapcj3p9srz.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  port: 3306,
  user: "uyp150ykdx7kkgmt",
  password: "u2hh316blcy6r3e4",
  database: "x44hwvczk3hlnp3b"
});

// Make connection.
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

// Export connection for our ORM to use.
module.exports = connection;
