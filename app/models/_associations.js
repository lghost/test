var Sequelize = require('sequelize');

module.exports = function(sequelize, db) {
  db.post.hasMany(db.employee);
  db.employee.belongsTo(db.post);
}
