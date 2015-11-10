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

// Request to add new employee
router.post('/employees/add', function (req, res) {
  // Check the required postId exists
  req.db.post.findOne({ where: { id: req.body.postId } }).then(function(post) {
    if (!post) return res.json('Должность не существует на сервере');
    // Ok, let's create
    req.db.employee.create({
      firstName:  req.body.firstName,
      lastName:   req.body.lastName,
      middleName: req.body.middleName,
      age:        req.body.age,
      postId:     req.body.postId
    }).spread(function(employee, created) {
      if (!created) return res.json('Не удалось создать');
      req.db.employee.findOne({ where: { id: employee.id }, attributes: [
        'id',
        'firstName',
        'lastName',
        'middleName',
        'age',
        'postId'
      ], include: [ {
        model: req.db.post,
        attributes: [ 'value' ]
      } ] }).then(function(employee) {
        res.json(employee);
      });
    })
  })
});

// Request to edit employee
router.post('/employees/edit/:id', function (req, res) {
  //req.params.id;

  res.json({});
});

// Request to remove employee
router.get('/employees/remove/:id', function (req, res) {
  //req.db.post.all({ where:  })
  //res.json({ err: JSON.stringify(req.body) });
  res.json({ err: 'In use!' });
});



// Returns post list when requested
router.get('/posts', function (req, res) {
  req.db.post.all({ attributes: ['id', 'value'] }).then(function(data) {
    res.json(data);
  });
});

// Request to add new post
router.post('/posts/add', function (req, res) {
  //req.db.post.all({ where:  })
  //res.json({ err: JSON.stringify(req.body) });
  res.json({ id: 3 });
});

// Request to edit post
router.post('/posts/edit/:id', function (req, res) {
  //req.db.post.all({ where:  })
  //res.json({ err: JSON.stringify(req.body) });
  res.json({});
});

// Request to remove post
router.get('/posts/remove/:id', function (req, res) {
  //req.db.post.all({ where:  })
  //res.json({ err: JSON.stringify(req.body) });
  res.json({ err: 'In use!' });
});

module.exports = router;
