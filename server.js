var routes    = require('./app/routes/');
var db_models = require('./app/models/');
var express   = require('express');
//var orm       = require('orm');
var Sequelize = require('sequelize');
var app       = express();
var sequelize = new Sequelize('mysql://test:qwerty@localhost/test_db');

// Adding middleware that enables static files support
app.use(express.static('public'));

var User = sequelize.define('User', {
  username: Sequelize.STRING,
  birthday: Sequelize.DATE
});

sequelize.sync();

app.use(function (req, res, next) {
  req.db = {
    
  };
});

// Adding third-party middleware - Node ORM for MySQL DB
/*if (false) app.use(orm.express('mysql://test:qwerty@localhost/test_db', {
  // Init function for ORM
  define: function (db, models, next) {
    // Adding models
    for (var model in db_models)
      models[model] = db_models[model](db);

    models.employee.hasOne("post", models.post);

    // Sync DB
    db.sync(function (err) {
      if (err) throw err;
    });

    next();
  }
}));*/

// Adding routes
for (var route in routes)
  app.use(routes[route].path, routes[route].router);

// Now start app
app.listen(3000);
