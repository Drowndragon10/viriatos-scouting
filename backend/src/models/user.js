const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const UserType = require('./userType');

const User = sequelize.define('users', {
  idUser: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  idUserType: {
    type: DataTypes.INTEGER,
    references: {
      model: UserType,
      key: 'idUserType',
    },
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: false,
});

module.exports = User;
