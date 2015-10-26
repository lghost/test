var express = require('express');
var router  = express.Router();

// Test response for GET '/api/' request
router.get('/', function (req, res) {
  // Test working with DB
  req.models.employee.one(function (err, employee) {
    if (err) throw err;

    // Just send first row/column in table (if exists)
    res.send(employee ? employee.post : "No Data");
  });
});
