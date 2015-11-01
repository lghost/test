var Sequelize = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('employee', {
    firstName: { type: Sequelize.STRING, allowNull: false },
    lastName: { type: Sequelize.STRING, allowNull: false },
    middleName: { type: Sequelize.STRING, allowNull: false },
    age: { type: Sequelize.INTEGER, allowNull: false },
  });
}
