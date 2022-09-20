const Sequelize = require('sequelize')
const connection = require('../database/database')
const Users = require('../User/Users')
// Criar tabela
const Articles = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }, description: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Users.hasMany(Articles)
Articles.belongsTo(Users)

// Articles.sync({force: true})
module.exports = Articles;

