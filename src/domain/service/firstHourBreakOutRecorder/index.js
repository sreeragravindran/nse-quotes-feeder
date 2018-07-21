const MODULE_ID = "SRC/DOMAIN/SERVICE/FIRSTHOURBREAKOUTCALCULATOR"; 
const stockExchange = require("../stockExchange");
const models = require("../../models");
const db = require("../../../db");

function firstHourBreakOutRecorder(){

    var breakOutData = (function(){
        var map = new Map();
        stockExchange.getAllStocks().forEach(stock => {
            map.set(stock.symbol, new models.FirstHourBreakOut());
        })
    })();

    var getFirstHourHighAndLow = function(stockSymbol, callback){
        db.IntradayQuotes.getQuotesForRange(
            stockSymbol, 
            stockExchange.getMarketOpenTime(), 
            stockExchange.getMarketOpenTime().addHours(1)
        ).then(quotes => {
            // calculate high and low 
            var high = quotes.max('high');
            var low = quotes.min('low');
            //return callback()
            
        }).catch(error => {
            console.logError(MODULE_ID, error);
            callback(error, null);
        })
    }

    this.getFirstHourBreakOut = function(stock, callback){
        // if it's still the first hour of the day
        // clear the value in the map for this stock 
        // this could be older data 
        if(stockExchange.isInFirstHour()) {
            map.set(stock.symbol, new models.FirstHourBreakOut());
            return callback(null, null);
        }
        
        if(stockExchange.isPastFirstHour()){
            // if the high and low for this stock doesnt exist
            // calculate and store them 
            breakOutData.set(stock.symbol, new models.FirstHourBreakOut());
            
               
        }
    }
}





