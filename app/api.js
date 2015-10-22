var express = require('express');
var orm = require('orm');
var router  = express.Router();

// Test response for GET '/api/' request
router.get('/', function (req, res) {
  // Test working with DB
  req.models.test.one(function (err, test) {
    if (err) throw err;

    // Just send first row/column in table (if exists)
    res.send(test ? test.value : "No Data");
  });
});

module.exports = router;
