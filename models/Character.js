// models/Character.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  // Sequelize instance

const Character = sequelize.define('Character', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    level: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    char_img: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Character;
