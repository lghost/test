var Sequelize = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('post', {
    value: { type: Sequelize.STRING, allowNull: false }
  });
}
