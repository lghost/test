var api     = require('./api');
var db      = require('./db');

var express = require('express');
var app     = express();

app.use(express.static('public')); // Adding middleware that enables static files support
app.use('/api', api); // Adding api middleware
db.connect(function (err) { // Connecting to DB
  if(!err) { // If we can connect, let's start express app
    console.log('Database is connected. Starting application...');
    app.listen(3000);
  } else console.log('Error connecting database.');
});
