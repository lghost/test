var routes    = require('./app/routes/');
var db_models = require('./app/models/');
var express   = require('express');
var orm       = require('orm');
var app       = express();

// Adding middleware that enables static files support
app.use(express.static('public'));

// Adding third-party middleware - Node ORM for MySQL DB
app.use(orm.express('mysql://test:qwerty@localhost/test_db', {
  // Init function for ORM
  define: function (db, models, next) {
    // Adding models
    for (var model in db_models)
      models[model] = db_models[model](db);

    // Sync DB
    db.sync(function (err) {
      if (err) throw err;
    });

    next();
  }
}));

// Adding routes
for (var route in routes)
  app.use(routes[route].path, routes[route].router);

// Now start app
app.listen(3000);
