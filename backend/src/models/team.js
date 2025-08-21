const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const AgeCategory = require('./ageCategory'); 
const TeamType = require('./teamType'); 
const User = require('./user');

const Team = sequelize.define('teams', {
  idTeam: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  idAgeCategory: {
    type: DataTypes.INTEGER,
    references: {
      model: AgeCategory,
      key: 'idAgeCategory',
    },
    allowNull: false,
  },
  idUser: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'idUser',
    },
    allowNull: false,
  },
  idTeamType: {
    type: DataTypes.INTEGER,
    references: {
      model: TeamType,
      key: 'idTeamType',
    },
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  district: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  county: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: false,
});

module.exports = Team;
