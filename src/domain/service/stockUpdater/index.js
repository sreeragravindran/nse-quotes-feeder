const MODULE_ID = "SRC/DOMAIN/SERVICE/STOCKUPDATER";
const alphaVantage = require('../alphaVantage');
const models = require('../../models');
const db = require('../../../db');
const utils = require('../../../utils');
const IchimokuCalculator = require('../ichimokuCalculator');

var BreakSignal = "BreakSignal";

function updateStockQuotes(onUpdateCallback){
    alphaVantage.getIntraday1mSeriesForAllStocks(function(error, stock){

        if(error){
            console.error(MODULE_ID, error); 
            return;
        }

        var now = new Date();
        var latestPrice = stock.getLatestPrice();
        
        if(latestPrice){
            db.models.LatestQuote.findOne({
                where : {symbol : stock.symbol}
            })
            .then(result => {
                if(result == null){
                    return insertQuote(stock); 
                } else { //if ( now.getDiffInMinutesFrom(result.updatedAt) >= 5 ){
                    return updateQuote(stock);
                }
                // exit chain here 
                return Promise.reject(BreakSignal);
            })
            .then(() => {
                 // update ichimoku indicators                     
                 return db.models.IntradayQuotes.findAll({
                     where : { symbol : stock.symbol }, 
                     attributes : ['id','symbol','high','low','open','close','volume'], 
                     order : [
                         ['createdAt', 'DESC'], 
                     ], 
                     limit : 52
                 }).then(priceHistory => {
                    console.log("update Ichimoku indicators")
                    var ichimokuIndicators = new IchimokuCalculator(priceHistory).getIndicators(); 
                    return db.models.IntradayQuotes.update(
                        { 
                            conversionLine : ichimokuIndicators.conversionLine,
                            baseLine : ichimokuIndicators.baseLine,
                            leadingSpanA : ichimokuIndicators.leadingSpanA,
                            leadingSpanB : ichimokuIndicators.leadingSpanB
                        },
                        {   where : { id : priceHistory[0].id },
                            returning : true, 
                            plain : true
                        }
                    )
                    .then(() => {
                        return priceHistory[0].id;
                    })
                })        
            })
            .then((updatedRecordId) => {
                console.log('sending update notification for ', stock.symbol) 
                db.models.IntradayQuotes.findOne({
                    where : {id :updatedRecordId} 
                }).then(result => {
                    onUpdateCallback(null, result.dataValues);  
                })                                                   
            })
            .catch((error) => {
                if(error != BreakSignal) {
                    console.error(MODULE_ID, "error: ", error);
                    onUpdateCallback(error, null);
                }
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


// db.models.IntradayQuotes.findAll({
//     where : { symbol : 'ACC' }, 
//     attributes : ['id'],
//     order : [
//         ['createdAt', 'DESC'], 
//     ], 
//     limit : 26 
// }).then(results => {
//     //var a = results.reduce((max, e) => e.volume > max ? e.volume : max, results[0].volume);
//     //console.log(a);    
//          results.forEach(element => {
//             console.log(element.id);
//          });        
// })


// db.models.IntradayQuotes.update(
//     { 
//         leadingSpanB : 41.96
//     },
//     {   where : { id : 155},
//         returning : true
//     }
// ).then(function(result){
//     return 25; 
// })
// .then(result => {
//     console.log(result);
// })


// db.models.IntradayQuotes.findOne({
//     where : {id : 187},
//     plain : true
// }).then(result => {
//     console.log(result.getAveragePrice());
// }) 