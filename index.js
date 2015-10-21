var express    = require("express");
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'test',
  password : 'qwerty',
  database : 'test_db'
});
var app = express();

app.get('/', function (req, res) {
  connection.query('SELECT * from users', function(err, rows, fields) {
    if (!err) {
      console.log('You got some data!');
      res.end(JSON.stringify(rows));
    } else console.log('Error while performing Query.');
  });
});

connection.connect(function (err) {
  if(!err) {
    console.log("Database is connected. Starting application...");
    app.listen(3000);
  } else console.log("Error connecting database.");
});
