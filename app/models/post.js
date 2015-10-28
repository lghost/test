var Sequelize = require('sequelize');

module.exports = function(sequelize) {
  return db.define('post', {
    value: String
  });
}
