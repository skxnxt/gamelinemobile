// models/Monster.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Monster = sequelize.define('Monster', {
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    level: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    damage: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    defense: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    exp: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    gold: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Monster;
