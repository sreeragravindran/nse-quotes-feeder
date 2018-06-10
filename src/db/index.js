const Sequelize = require('sequelize'); 
const sequelize = new Sequelize('stockQuotes', '', '', {
    dialect : 'sqlite',
    storage : '/Users/zf58/sqlite/stock_quotes.db'
});

const models = {
    IntradayQuotes : sequelize.define('intraday_quotes', {
        id : { type : Sequelize.INTEGER, primaryKey: true, autoIncrement : true },
        symbol : { type : Sequelize.STRING, allowNull: false }, 
        timestamp : {type : Sequelize.DATE, allowNull: false }, 
        open : { type : Sequelize.DECIMAL(16,2), allowNull: false }, 
        high : { type : Sequelize.DECIMAL(16,2), allowNull: false }, 
        low : { type : Sequelize.DECIMAL(16,2), allowNull: false }, 
        close : { type : Sequelize.DECIMAL(16,2), allowNull: false }, 
        volume : { type : Sequelize.INTEGER(16,2), allowNull: false }, 
        conversionLine : { type: Sequelize.DECIMAL(16,2), allowNull : true },
        baseLine : { type :Sequelize.DECIMAL(16,2), allowNull: true }, 
        leadingSpanA : { type: Sequelize.DECIMAL(16,2), allowNull: true }, 
        leadingSpanB : { type: Sequelize.DECIMAL(16,2), allowNull: true }, 
        averagePrice : { type: Sequelize.DECIMAL(16,2), allowNull: true },
        upOrDown : { type: Sequelize.INTEGER, allowNull: true }, 
        rawMoneyFlow : { type: Sequelize.DECIMAL(16,2), allowNull: true },
        positiveMoneyFlow : { type: Sequelize.DECIMAL(16,2), allowNull: true },
        negativeMoneyFlow: { type: Sequelize.DECIMAL(16,2), allowNull: true }
    }), 
    LatestQuote : sequelize.define('latest_quote', {
        symbol : {type : Sequelize.STRING, allowNull: false, primaryKey : true },
        closingPrice : { type: Sequelize.DECIMAL(16,4), allowNull: false}        
    },{
        freezeTableName: true
    })
}

models.IntradayQuotes.removeAttribute('id');
models.IntradayQuotes.removeAttribute('updatedAt');

models.IntradayQuotes.prototype.getAveragePrice = function(){
    return ( this.high + this.low + this.close) / 3;
}

module.exports = {
    dbInstance : sequelize, 
    models : models
}