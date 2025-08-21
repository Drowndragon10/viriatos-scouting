const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Guardian = sequelize.define('guardians', {
  idGuardian: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact: {
    type: DataTypes.STRING(9),
    allowNull: false,
    validate: {
      len: [9, 9],
      isNumeric: true,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  timestamps: false,
});

module.exports = Guardian;
