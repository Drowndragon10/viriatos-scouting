const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Athlete = require('./athlete');
const User = require('./user');

const Report = sequelize.define('reports', {
  idReport: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  idAthlete: {
    type: DataTypes.INTEGER,
    references: {
      model: Athlete,
      key: 'idAthlete',
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
  technique: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 4,
    },
  },
  speed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 4,
    },
  },
  competitiveAttitude: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 4,
    },
  },
  intelligence: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 4,
    },
  },
  height: {
    type: DataTypes.ENUM('Baixo', 'Médio', 'Alto'),
    allowNull: false,
    field: 'height'
  },
  morphology: {
    type: DataTypes.ENUM('Ectomorfo', 'Mesomorfo', 'Endomorfo'),
    allowNull: false,
    field: 'morphology'
  },
  finalRating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 4,
    },
  },
  freeText: {
    type: DataTypes.STRING(1024),
    allowNull: true,
  },
  reportDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('Em revisão', 'Aprovado', 'Rejeitado'),
    allowNull: false,
    defaultValue: 'Em revisão',
    field: 'status'
  },
}, {
  timestamps: false,
});

module.exports = Report;
