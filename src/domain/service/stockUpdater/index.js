const MODULE_ID = "Service.StockUpdater";
const alphaVantage = require('../alphaVantage');
const models = require('../../models');
const db = require('../../../db');

Date.prototype.getDiffInMinutesFrom = function(anotherDate){
    return Math.round((this.getTime() - anotherDate.getTime()) / 60000 ); 
}

function updateStockQuotes(onUpdateCallback){
    alphaVantage.getIntraday1mSeriesForAllStocks(function(error, data){

        if(error){
            console.error(MODULE_ID, error); 
            return;
        }

        var now = new Date();

        // todo: try refactoring 
        var stock = new models.Stock();
        stock = data; 
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
                if(result = null){
                    insertQuote(stock, onUpdateCallback); 
                } else {
                    if ( now.getDiffInMinutesFrom(result.updatedAt) >= 5 ){
                        updateQuote(stock, onUpdateCallback);
                    }
                }
            })

            // do the itchimoku calculations 
        }
        
    })    
}


function insertQuote(stock, onUpdateCallback){
    // add in intradayQuotes 
    // update in latestQuotes 
    var latestPrice = stock.getLatestPrice();
    
    db.models.IntradayQuotes.create({ 
        symbol : stock.symbol, 
        timestamp : new Date(),
        open : latestPrice.open,
        high : latestPrice.high,
        low : latestPrice.low,
        close : latestPrice.close, 
        volume : latestPrice.volume
    }).then(function(){
        return db.models.LatestQuote.create({
            symbol : stock.symbol,
            closingPrice : latestPrice.close
        });
    }).then(function(){
        onUpdateCallback(null, stock); 
    }).catch(function(error){
        console.log(MODULE_ID, error);
        onUpdateCallback(error, null);
    })
    
}


function updateQuote(stock, onUpdateCallback){
    // add in intradayQuotes 
    // update in latestQuotes 
    var latestPrice = stock.getLatestPrice();
    
    db.models.IntradayQuotes.create({ 
        symbol : stock.symbol, 
        timestamp : new Date(),
        open : latestPrice.open,
        high : latestPrice.high,
        low : latestPrice.low,
        close : latestPrice.close, 
        volume : latestPrice.volume
    }).then(function(){
        return db.models.LatestQuote.update(
           { closingPrice : latestPrice.close}, 
           { symbol : stock.symbol }
        );
    }).then(function(){
        onUpdateCallback(null, stock); 
    }).catch(function(error){
        console.log(MODULE_ID, error);
       onUpdateCallback(error, null);
    })
    
}

module.exports = {
    updateStockQuotes : updateStockQuotes
}

// db.models.LatestQuote.findOne().then(r => {
//     console.log(r);
//  })

// db.models.IntradayQuotes.findOne({    
//      where : {
//          symbol : 'ACC'
//      }
// }).then(result => {
//     console.log(result.symbol);
//     return db.models.IntradayQuotes.findOne({    
//         where : {
//             symbol : 'ADANIENT'
//         }
//    }) 
// }).then(result => {
//     console.log(result.createdAt);
// })
