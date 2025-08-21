const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Guardian = require('./guardian');
const Team = require('./team');
const Position = require('./position');

const Athlete = sequelize.define('athletes', {
    idAthlete: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    idGuardian: {
        type: DataTypes.INTEGER,
        references: {
            model: Guardian,
            key: 'idGuardian',
        },
        allowNull: true,
    },
    idTeam: {
        type: DataTypes.INTEGER,
        references: {
            model: Team,
            key: 'idTeam',
        },
        allowNull: true,
    },
    idPosition: {
        type: DataTypes.INTEGER,
        references: {
            model: Position,
            key: 'idPosition',
        },
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    birthDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    nationality: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    birthplace: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0,
            max: 5,
        },
    },
}, {
    timestamps: false,
});

module.exports = Athlete;
