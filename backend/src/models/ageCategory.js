const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const AgeCategory = sequelize.define('ageCategories', {
  idAgeCategory: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  }
}, {
  timestamps: false,
});

module.exports = AgeCategory;
