const MODULE_ID = "domain.service.stockUpdater";
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
            var priceWasUpdated = false; 
            db.models.LatestQuote.findOne({
                where : {symbol : stock.symbol}
            })
            .then(result => {
                if(result == null){
                    priceWasUpdated = true;
                    return insertQuote(stock); 
                } else if ( now.getDiffInMinutesFrom(result.updatedAt) >= 5 ){
                    priceWasUpdated = true; 
                    return updateQuote(stock);
                }                
            })
            .then(() => {
                 // do ichimoku calculations                    
                //  db.models.IntradayQuotes.findAll({
                //      where : { symbol : stock.symbol }, 
                //      order : [
                //          ['createdAt', 'DESC'], 
                //      ], 
                //      limit : 26 
                //  }).then(results => {                                            
                //     if(results && results.length >= 9){
                //         // update conversion line 
                //         var ninePeriod = results.slice(0,9) ; 
                //         var ninePeriodHigh = ninePeriod.reduce((max, e) => e.high > max ? e.high : max, results[0].high);                           
                //         var ninePeriodLow = ninePeriod.reduce((min, e) => e.low < min ? e.low : min, results[0].low);                           
                //         var conversionLine = (ninePeriodHigh + ninePeriodLow) / 2 ; 

                //     }        
                //  })

            })
            .then(() => {
                if(priceWasUpdated){                                     
                    onUpdateCallback(null, stock);     
                }
            })
            .catch((error) => {
                console.error(MODULE_ID, error);
                onUpdateCallback(error, null);
            })            
        }        
    })    
}


function insertQuote(stock){
    var latestPrice = stock.getLatestPrice();
    
    return insertIntradayQuote(stock).then(function(){
        return db.models.LatestQuote.create({
            symbol : stock.symbol,
            closingPrice : latestPrice.close
        });
    });
    
}

function updateQuote(stock){
    var latestPrice = stock.getLatestPrice();
    
    return insertIntradayQuote(stock).then(function(){
        return db.models.LatestQuote.update(
           { closingPrice : latestPrice.close }, 
           { where : 
                { symbol : stock.symbol } 
           } 
        );
    })    
}

function insertIntradayQuote(stock){
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


db.models.IntradayQuotes.findAll({
    where : { symbol : 'ACC' }, 
    attributes : ['id'],
    order : [
        ['createdAt', 'DESC'], 
    ], 
    limit : 26 
}).then(results => {
    //var a = results.reduce((max, e) => e.volume > max ? e.volume : max, results[0].volume);
    //console.log(a);    
         results.forEach(element => {
            console.log(element.symbol);
         });        
})
