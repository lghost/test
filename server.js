var config     = require('./app/config');
var models     = require('./app/models/');
var routes     = require('./app/routes/');

var express    = require('express');
var bodyParser = require('body-parser')
var path       = require('path');
var Sequelize  = require('sequelize');

var app        = express();
var sequelize  = new Sequelize(config.db.database, config.db.username, config.db.password, {
  host: config.db.host,
  dialect: config.db.dialect
});

// Adding middleware that enables static files support
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

var db = {};

for (var model in models)
  if (model != '_associations')
    db[model] = models[model](sequelize);

if (models._associations)
  models._associations(sequelize, db);

sequelize.sync({ force: true }).then(function () {
  /* Adding test data */
  db.employee.findOrCreate({ where: { firstName: 'Foo' }, defaults: {
    lastName: 'Foo',
    middleName: 'Foo',
    age: 44,
    post: {
      value: 'Murderer'
    }
  }, include: [ db.post ] });
  db.employee.findOrCreate({ where: { firstName: 'Bar' }, defaults: {
    lastName: 'Bar',
    middleName: 'Bar',
    age: 22,
    post: {
      value: 'Victim'
    }
  }, include: [ db.post ] });
});

// Adding simpliest DB ORM middleware
app.use(function (req, res, next) {
  req.db = db;
  next();
});

// Adding routes
for (var route in routes)
  app.use(routes[route].path, routes[route].router);

// Now start app
app.listen(config.port, config.host);




