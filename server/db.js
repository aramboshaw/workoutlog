const Sequelize = require('sequelize');

const sequelize = new Sequelize("postgres://postgres:5e53217280b24d0ca3690b71b967a3db@localhost:5432/workout-log");

module.exports = sequelize;