const config = require('../../config');
const Sequelize = require('sequelize'); 
const sequelize = new Sequelize('stockQuotes', '', '', {
    dialect : 'sqlite',
    storage : config.db.storage
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

models.IntradayQuotes.prototype.isEqual(other) = function(){
    if(this.open == other.open && 
        this.close == other.close && 
        this.high == other.high &&
        this.low == other.low &&
        this.volume == other.volume
    ){
        return true;
    }
    return false;    
}

models.IntradayQuotes.getIchimokuIndicators = function(){
    return sequelize.query(`
        SELECT 
            iq.symbol, iq.open, iq.high, iq.low, iq.close, iq.volume, iq.conversionLine, iq.baseLine, 
            iq.leadingSpanA, iq.leadingSpanB, iq.averagePrice, iq.upOrDown,
            iq.rawMoneyFlow, iq.positiveMoneyFlow, iq.negativeMoneyFlow, 
            iq.fourteenPeriodMFRatio, iq.fourteenPeriodMFIndex
        FROM 
            intraday_quotes iq 
        JOIN
        (
            SELECT symbol, MAX(id) AS id 
            FROM intraday_quotes 
            GROUP BY symbol  
        ) iqMax
        ON iq.id = iqMax.id`
    ).then(result => {
        return result[0]; 
    })
}

module.exports = {
    dbInstance : sequelize, 
    models : models
}
