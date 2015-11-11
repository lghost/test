var express = require('express');
var router  = express.Router();

// Returns employee list when requested
router.get('/employees', function (req, res) {
  // Find all employees
  req.db.employee.all({ attributes: [
    'id',
    'firstName',
    'lastName',
    'middleName',
    'age',
    'postId'
  // Add post name
  ], include: [ {
    model: req.db.post,
    attributes: [ 'value' ]
  } ] }).then(function(employees) {
    // Return employees array
    res.json(employees);
  });
});

// Request to add new employee
router.post('/employees/add', function (req, res) {
  // Check the required postId exists
  req.db.post.findById(req.body.postId).then(function(post) {
    if (!post) return res.json({ err: 'Должность не существует на сервере' });
    // If OK let's create
    req.db.employee.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      middleName: req.body.middleName,
      age: req.body.age,
      postId: req.body.postId
    }).then(function(employee) {
      if (!employee) return res.json({ err: 'Не удалось создать' });
      // Return new one
      res.json({ newOne: {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        middleName: employee.middleName,
        age: employee.age,
        postId: employee.postId,
        post: {
          value: post.value
        }
      } });
    });
  });
});

// Request to edit employee
router.post('/employees/edit/:id', function (req, res) {
  // Check the required postId exists first
  req.db.post.findById(req.body.postId).then(function(post) {
    if (!post) return res.json({ err: 'Должность не существует на сервере' });
    // Try to update employee...
    req.db.employee.update({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      middleName: req.body.middleName,
      age: req.body.age,
      postId: req.body.postId
      // ...with requested ID
    }, { where: { id: req.params.id } }).then(function(result) {
      if (!result[0]) return res.json({ err: 'Сотрудник не существует на сервере' });
      // result[0] only contains num of updated rows. So wee need to find updated item
      req.db.employee.findById(req.params.id, { attributes: [
        'id',
        'firstName',
        'lastName',
        'middleName',
        'age',
        'postId'
      // Add post name
      ], include: [ {
        model: req.db.post,
        attributes: [ 'value' ]
      } ] }).then(function(employee) {
        // Return new one
        res.json({ newOne: employee });
      });
    });
  });
});

// Request to remove employee
router.get('/employees/remove/:id', function (req, res) {
  // Try to destroy employee with required ID
  req.db.employee.destroy({ where: { id: req.params.id } }).then(function(numOfDeleted){
    if (!numOfDeleted) return res.json({ err: 'Сотрудник не существует на сервере' });
    res.json({});
  });
});



// Returns post list when requested
router.get('/posts', function (req, res) {
  req.db.post.all({ attributes: ['id', 'value'] }).then(function(posts) {
    res.json(posts);
  });
});

// Request to add new post
router.post('/posts/add', function (req, res) {
  req.db.post.create({ value: req.body.value }).then(function(post) {
    if (!post) return res.json({ err: 'Не удалось создать' });
    // Return new one's id
    res.json({ id: post.id });
  });
});

// Request to edit post
router.post('/posts/edit/:id', function (req, res) {
  req.db.post.update({ value: req.body.value },
                     { where: { id: req.params.id } }).then(function(result) {
    if (!result[0]) return res.json({ err: 'Должность не существует на сервере' });
    res.json({});
  });
});

// Request to remove post
router.get('/posts/remove/:id', function (req, res) {
  // Check the required postId exists first
  req.db.post.findById(req.params.id).then(function(post) {
    if (!post) return res.json({ err: 'Должность не существует на сервере' });
    // Now check that no employee on this post
    req.db.employee.all({ where: { postId: req.params.id } }).then(function(employees) {
      if (employees.length) return res.json({ err: 'На этой должности ' +
                                                   employees.length +
                                                   ' сотрудник' + (function(length) {
        if (length%10 == 1) return '';
        if (length%10 < 5) return 'а';
        return 'ов';
      })(employees.length) });
      // Clear way
      req.db.post.destroy({ where: { id: req.params.id } }).then(function(numOfDeleted){
        if (!numOfDeleted) return res.json({ err: 'Не удалось удалить' });
        res.json({});
      });
    });
  });
});

module.exports = router;
