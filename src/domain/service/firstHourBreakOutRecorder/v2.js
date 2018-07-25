const MODULE_ID = "SRC/DOMAIN/SERVICE/FIRSTHOURBREAKOUTCALCULATOR"; 
const stockExchange = require("../stockExchange");
const models = require("../../models");
const db = require("../../../db");

function firstHourBreakOutRecorder(){

    var newEmptyFirstHourBreakOut = function(){
        return new models.FirstHourBreakOut();
    }

    var breakOutDataMap = (function(){
        var map = new Map();
        stockExchange.getAllStocks().forEach(stock => {
            map.set(stock.symbol, newEmptyFirstHourBreakOut());
        })
        return map;
    })();

    var getFirstHourHighAndLow = function(stockSymbol){
        return db.IntradayQuotes.getQuotesForRange(
            stockSymbol, 
            stockExchange.getMarketOpenTime(), 
            stockExchange.getMarketOpenTime().addHours(1)
        ).then(quotes => {
            if(quotes.length > 0){
                var high = quotes.max('high');
                var low = quotes.min('low');
                return { "high": high, "low": low };
            }
            return null;    
        })
    }

    var setHighAndLowBreakOutTime = function(stock, breakOut){

        if(breakOut.isHighBreakOutPresent() && breakOut.isLowBreakOutPresent()){
            return breakOut;
        }
        if(!breakOut.isHighBreakOutPresent()){
            // set high break out time 
            if(stock.high > breakOut.high){
                breakOut.highBreakOutTime = stock.createdAt; 
            }                 
        }
        if(!breakOut.isLowBreakOutPresent()){
            if(stock.low < breakOut.low){
                breakOut.lowBreakOutTime = stock.createdAt;
            }
        }
        return breakOut;      
    }

    this.getFirstHourBreakOut = function(stock){

        var breakOut = breakOutDataMap.get(stock.symbol);

        return new Promise(function(resolve, reject){
            
            if(stockExchange.isInFirstHour()) {           

                if(breakOut.isHighAndLowPresent()) {
                    breakOut = newEmptyFirstHourBreakOut();
                    breakOutDataMap.set(stock.symbol, breakOut);    
                }
                reject("cannot calculate first hour break out times yet !");

            } else if(stockExchange.isPastFirstHour()){

                if(!breakOut.isHighAndLowPresent()){
                    getFirstHourHighAndLow()
                    .then(result => {
                        if(result){
                            breakOut.high = result.high;
                            breakOut.low = result.low;
                        } 
                        resolve(breakOut);                             
                    })
                } else {
                    resolve(breakOut);                    
                }
            }
        }).then(breakOut => {
            if(breakOut){
                setHighAndLowBreakOutTime(stock, breakOut);
                breakOutDataMap.set(stock.symbol, breakOut);
            }
            return breakOut;
        }).catch(error => {
            console.log(MODULE_ID, error);
            return breakOut;
        })
    }
}

module.exports = new firstHourBreakOutRecorder();