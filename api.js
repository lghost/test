var db      = require('./db');

var express = require('express');
var router  = express.Router();

router.get('/', function (req, res) { // Test response for GET '/api/' request
  db.query('SELECT * from users', function(err, rows, fields) { // Test working with DB
    if (!err) {
      res.send(JSON.stringify(rows)); // Just send raw DB data
    } else {
      console.log('Error while performing Query.');
      res.send("Server error");
    }
  });
});

module.exports = router;
