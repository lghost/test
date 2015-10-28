var config    = require('./config');
var models    = require('./app/models/');
var routes    = require('./app/routes/');

var express   = require('express');
var path      = require('path');
var Sequelize = require('sequelize');

var app       = express();
var sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
  host: config.db.host,
  dialect: config.db.dialect
});

// Adding middleware that enables static files support
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.bodyParser());

var db = {};

for (var model in models)
  db[model] = models[model](sequelize);

sequelize.sync();

// Adding DB ORM middleware
app.use(function (req, res, next) {
  req.db = db;
  next();
});

// Adding routes
for (var route in routes)
  app.use(routes[route].path, routes[route].router);

// Now start app
app.listen(config.port);
