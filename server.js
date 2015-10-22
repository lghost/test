var api     = require('./app/api');
var express = require('express');
var orm     = require('orm');
var app     = express();

// Adding middleware that enables static files support
app.use(express.static('public'));
// Adding third-party middleware - Node ORM for MySQL DB
app.use(orm.express('mysql://test:qwerty@localhost/test_db', {
  // Init function for ORM
  define: function (db, models, next) {
    // Sync with table "test"
    models.test = db.define('test', {
      value: String
    });

    db.sync(function (err) {
      if (err) throw err;
    });

    next();
  }
}));
// Adding api middleware
app.use('/api', api);
// Now start app
app.listen(3000);
