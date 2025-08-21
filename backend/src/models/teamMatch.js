const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Team = require('./team');
const Match = require('./match');

const TeamMatch = sequelize.define('teamsMatches', {
  idTeamMatch: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  idTeam: {
    type: DataTypes.INTEGER,
    references: {
      model: Team,
      key: 'idTeam',
    },
    allowNull: false,
  },
  idMatch: {
    type: DataTypes.INTEGER,
    references: {
      model: Match,
      key: 'idMatch',
    },
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('casa', 'visitante'),
    allowNull: false,
    field: 'role',
  },
}, {
  timestamps: false,
});


module.exports = TeamMatch;
