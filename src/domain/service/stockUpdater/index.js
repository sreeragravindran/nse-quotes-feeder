const MODULE_ID = "Service.StockUpdater";
const alphaVantage = require('../alphaVantage');
const models = require('../../models');
const db = require('../../../db');

Date.prototype.getDiffInMinutesFrom = function(anotherDate){
    return Math.round((this.getTime() - anotherDate.getTime()) / 60000 ); 
}

function updateStockQuotes(onUpdateCallback){
    alphaVantage.getIntraday1mSeriesForAllStocks(function(error, stock){

        if(error){
            console.error(MODULE_ID, error); 
            return;
        }

        var now = new Date();
        var latestPrice = stock.getLatestPrice();
        
        if(latestPrice){

            // check if latestQuote table has entry 
            // if not, create one and insert into intradayQuotes as well 
            // else get the latestQuote updatedAt 
            // if it is updated within the last 5 mins
            // do nothing 
            // else, record in intradayQuotes and update in latestQuotes
            
            db.models.LatestQuote.findOne({
                where : {symbol : stock.symbol}
            }).then(result => {
                if(result == null){
                    return insertQuote(stock); 
                } else if ( now.getDiffInMinutesFrom(result.updatedAt) >= 5 ){
                    return updateQuote(stock);
                }                
            }).then(() => {
               onUpdateCallback(null, stock);     
            }).catch((error) => {
                console.error(MODULE_ID, error);
                onUpdateCallback(error, null);
            })

            // do the itchimoku calculations 
        }
        
    })    
}


function insertQuote(stock){
    // add in intradayQuotes 
    // update in latestQuotes 
    var latestPrice = stock.getLatestPrice();
    
    return createQuote(stock).then(function(){
        return db.models.LatestQuote.create({
            symbol : stock.symbol,
            closingPrice : latestPrice.close
        });
    });
    
}


function updateQuote(stock){
    // add in intradayQuotes 
    // update in latestQuotes 
    var latestPrice = stock.getLatestPrice();
    
    return createQuote(stock).then(function(){
        return db.models.LatestQuote.update(
           { closingPrice : latestPrice.close }, 
           { where : 
                { symbol : stock.symbol } 
           } 
        );
    })    
}

function createQuote(stock){
    var latestPrice = stock.getLatestPrice();
    return db.models.IntradayQuotes.create({ 
        symbol : stock.symbol, 
        timestamp : new Date(),
        open : latestPrice.open,
        high : latestPrice.high,
        low : latestPrice.low,
        close : latestPrice.close, 
        volume : latestPrice.volume
    })
}

module.exports = {
    updateStockQuotes : updateStockQuotes
}