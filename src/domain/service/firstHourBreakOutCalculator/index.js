const MODULE_ID = "SRC/DOMAIN/SERVICE/FIRSTHOURBREAKOUTCALCULATOR"; 
const stockExchange = require("../stockExchange");
const models = require("../../models");
const db = require("../../../db");

function firstHourBreakOutCalculator(){

    var breakOutData = (function(){
        var map = new Map();
        stockExchange.getAllStocks().forEach(stock => {
            map.set(stock.symbol, null);
        })
    })();

    var getFirstHourHighAndLow = function(stockSymbol, callback){
        //db.IntradayQuotes.getFirstHourData(stockSymbol, new Date().getda)
    }

    this.getFirstHourBreakOut = function(stock, callback){
        // if it's still the first hour of the day
        // clear the value in the map for this stock 
        // this could be older data 
        if(stockExchange.isFirstHour()) {
            map.set(stock.symbol, null);
            return callback(null, null);
        }
        
        if(stockExchange.isPastFirstHour()){
            // if the high and low for this stock doesnt exist
            // calculate and store them 
            breakOutData.set(stock.symbol, new models.FirstHourBreakOut());
        }
    }
}





