const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const UserType = sequelize.define('userTypes', {
  idUserType: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  }
}, {
  timestamps: false
});

module.exports = UserType;
