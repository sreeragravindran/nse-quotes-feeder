const Sequelize = require('sequelize'); 
const sequelize = new Sequelize('sqlite:/Users/zf58/sqlite/stock_quotes.db');

const models = {
    IntradayQuotes : sequelize.define('intraday_quotes', {
        symbol : { type : Sequelize.STRING, allowNull: false }, 
        timestamp : {type : Sequelize.DATE, allowNull: false }, 
        open : {type : Sequelize.DECIMAL(16,4), allowNull: false }, 
        high : {type : Sequelize.DECIMAL(16,4), allowNull: false }, 
        low : {type : Sequelize.DECIMAL(16,4), allowNull: false }, 
        close : {type : Sequelize.DECIMAL(16,4), allowNull: false }, 
        volume : {type : Sequelize.INTEGER(16,4), allowNull: false } 
    }) 
}

models.IntradayQuotes.removeAttribute('id');
models.IntradayQuotes.removeAttribute('updatedAt');

module.exports = {
    dbInstance : sequelize, 
    models : models
}