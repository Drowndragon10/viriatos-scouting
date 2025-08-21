const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Position = sequelize.define('positions', {
  idPosition: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = Position;