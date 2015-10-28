var Sequelize = require('sequelize');

module.exports = function(sequelize) {
  return db.define('employee', {
    first_name: String,
    last_name: String,
    middle_name: String,
    post: String,
    age: Number
  });
}
