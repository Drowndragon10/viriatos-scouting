const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Match = sequelize.define('matches', {
  idMatch: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  matchDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  county: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  district: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: false,
});

module.exports = Match;
