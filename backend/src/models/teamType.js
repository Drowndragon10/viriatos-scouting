const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const TeamType = sequelize.define('teamTypes', {
  idTeamType: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = TeamType;
