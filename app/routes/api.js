var express = require('express');
var router  = express.Router();

// Test response for GET '/api/' request
/*router.get('/', function (req, res) {
  // Test working with DB
  req.models.employee.one(function (err, employee) {
    if (err) throw err;

    // Just send first row/column in table (if exists)
    res.send(employee ? employee.post : "No Data");
  });
});*/

// Returns employee list when requested
router.get('/employees', function (req, res) {
  req.db.employee.all({ attributes: [
    'id',
    'firstName',
    'lastName',
    'middleName',
    'age',
    'postId'
  ], include: [ {
    model: req.db.post,
    attributes: [ 'value' ]
  } ] }).then(function(data) {
    res.json(data);
  });
});

// Returns post list when requested
router.get('/posts', function (req, res) {
  req.db.post.all({ attributes: ['id', 'value'] }).then(function(data) {
    res.json(data);
  });
});

module.exports = router;
