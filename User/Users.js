const Sequelize = require('sequelize');
const connection = require('../database/database');

const Users = connection.define('users', {
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }, photo: {
        type: Sequelize.STRING,
        allowNull: false
    }
})
// Users.sync({force: true})
module.exports = Users;