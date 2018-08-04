const MODULE_ID = "SRC/DOMAIN/SERVICE/STOCKEXCHANGE";
const models = require("../../models");
const config = require("../../../../config");
const utils = require("../../../utils");

function stockExchange(){
    this.name = "NSE";
    var stocks =  getAllStocks();

    this.getAllStocks = function(){
        return stocks; 
    }

    this.getMarketOpenTime = function(){
        // date values are passed in the local time
        // the equivalent GMT datetime is set 
        // hence, it will work only if the system timezone is IST 
        var now = new Date();
        var marketOpenTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 15, 0);
        return marketOpenTime;
    }

    this.getMarketCloseTime = function(){
        var now = new Date();
        var marketCloseTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 30, 0);
        return marketCloseTime;
    }

    this.isOpen = function(){
        var now = new Date();
        return (now.getDay() > 0 && now.getDay() < 6 && now.isBetween(this.getMarketOpenTime(), this.getMarketCloseTime()));
    }

    this.isInFirstHour = function(){
        var now = new Date();
        var marketOpenTime = this.getMarketOpenTime();
        return now.isBetween(marketOpenTime, marketOpenTime.addHours(1));
    }

    this.isPastFirstHour = function(){
        var now = new Date();      
        return now.isAheadOf(this.getMarketOpenTime().addHours(1));
    }
}

function getAllStocks() {
    var stocks = [];
    var fs = require('fs');
    var symbols = fs.readFileSync(config.stockExchange.stockSource).toString().split("\n");
    symbols.forEach(s => {
        stocks.push(new models.Stock(s));
    });
    return stocks;
}


module.exports = new stockExchange();

//var s = new stockExchange();

//console.log(s.isPastFirstHour(), s.getMarketOpenTime(), s.getMarketCloseTime(), s.isOpen());

// console.log(s.getMarketOpenTime());
// console.log(s.getMarketOpenTime().addHours(1));
// console.log(s.getMarketOpenTime());

//console.log((new stockExchange()).getAllStocks());