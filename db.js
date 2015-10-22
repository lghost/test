var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'test',
  password : 'qwerty',
  database : 'test_db'
});

module.exports = connection;
