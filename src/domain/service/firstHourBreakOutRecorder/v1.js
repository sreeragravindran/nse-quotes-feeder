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
        return map;
    })();

    var getFirstHourHighAndLow = function(stockSymbol, callback){
        db.IntradayQuotes.getQuotesForRange(
            stockSymbol, 
            stockExchange.getMarketOpenTime(), 
            stockExchange.getMarketOpenTime().addHours(1)
        ).then(quotes => {
            if(quotes.length > 0){
                var high = quotes.max('high');
                var low = quotes.min('low');
                return callback(null, new models.FirstHourBreakOut(high, low));
            }    
            // calculate high and lo            
        }).catch(error => {
            console.logError(MODULE_ID, error);
            callback(error, null);
        })
    }

    this.getBreakOutData = function(){
        return breakOutData;
    }

    this.getFirstHourBreakOut = function(stock, callback){
        // if it's still the first hour of the day
        // clear the value in the map for this stock 
        // this could be older data 
        if(stockExchange.isInFirstHour()) {
            breakOutData.set(stock.symbol, new models.FirstHourBreakOut());
            return callback(null, null);
        }
        
        if(stockExchange.isPastFirstHour()){
            // if the high and low for this stock doesnt exist
            // calculate and store them 
            var breakOut = breakOutData.get(stock.symbol);
            if(!breakOut.isHighAndLowPresent()){
                getFirstHourHighAndLow(stock.symbol, function onResponse(error, data){
                    if(data){
                        // expect data to be of type FirstHourBreakOut 
                        // with high and low set 
                        breakOutData.set(stock.symbol, data);
                        return setHighAndLowBreakOut(stock, callback)                        
                    }
                })
            } else {
                return setHighAndLowBreakOut(stock, callback);
            }
        }
    }

    var setHighAndLowBreakOut = function(stock, callback){
        var breakOut = breakOutData.get(stock.symbol);

        if(breakOut.isHighBreakOutPresent() && breakOut.isLowBreakOutPresent()){
            return callback(null, breakOut);
        }

        if(!breakOut.isHighBreakOutPresent()){
            // set high break out time 
            if(stock.high > breakOut.high){
                breakOut.highBreakOutTime = stock.createdAt; 
                breakOutData.set(stock.symbol, breakOut);
            }                 
        }

        if(!breakOut.isLowBreakOutPresent()){
            if(stock.low < breakOut.low){
                breakOut.lowBreakOutTime = stock.createdAt;
                breakOutData.set(stock.symbol, breakOut);
            }
        }

        return callback(null, breakOut);       
    }
}


module.exports = new firstHourBreakOutRecorder();