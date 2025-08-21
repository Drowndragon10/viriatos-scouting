const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Match = require('./match');
const User = require('./user');
const Athlete = require('./athlete');

const Task = sequelize.define('tasks', {
  idTask: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  idMatch: {
    type: DataTypes.INTEGER,
    references: {
      model: Match,
      key: 'idMatch',
    },
  },
  idAthlete: {
    type: DataTypes.INTEGER,
    references: {
      model: Athlete,
      key: 'idAthlete',
    },
  },
  idUser: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'idUser',
    },
  },
  title: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(1024),
    allowNull: false,
  },
  taskDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('Pendente', 'Cancelada', 'Concluída'),
    allowNull: false,
    defaultValue: 'Pendente',
    field: 'status',
  },
}, {
  timestamps: false,
});

module.exports = Task;
