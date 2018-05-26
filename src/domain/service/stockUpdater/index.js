const alphaVantage = require('../alphaVantage');
const models = require('../../models');
const db = require('../../../db');

function updateStockQuotes(onUpdateCallback){
    alphaVantage.getIntraday1mSeriesForAllStocks(function(error, data){

        if(error){
            console.error(error); 
            return;
        }

        var stock = new models.Stock();
        stock = data; 
        var latestPriceVolume = stock.getLatestPrice();
        
        if(latestPriceVolume){

            // read the latest data in db, 
            // update data only if the last updated time has >= 5 mins 

            // do the itchimoku calculations 

            db.models.IntradayQuotes.create({ 
                symbol : stock.symbol, 
                timestamp : new Date(),
                open : latestPriceVolume.open,
                high : latestPriceVolume.high,
                low : latestPriceVolume.low,
                close : latestPriceVolume.close, 
                volume : latestPriceVolume.volume
            }).then(function(){
                console.log("updated in db")
                //onUpdateCallback(null, stock);
            }).catch(function(error){
                console.log(error);
               // onUpdateCallback(error, null);
            })
        }
        
    })    
}

module.exports = {
    updateStockQuotes : updateStockQuotes
}