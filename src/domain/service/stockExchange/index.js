const MODULE_ID = "SRC/DOMAIN/SERVICE/STOCKEXCHANGE";
const models = require("../../models");
const config = require("../../../../config");

function stockExchange(){
    this.name = "NSE";
    var stocks =  getAllStocks();

    this.getAllStocks = function(){
        return stocks; 
    }

    this.isOpen = function(){
        var now = new Date();
        var marketOpenTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 15, 0);
        var marketCloseTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 30, 0);
        return (now.getDay() > 0 && now.getDay() < 6 && now.isBetween(marketOpenTime, marketCloseTime));
    }

    this.isFirstHour = function(){
        var now = new Date();
        // date values are passed in the local time
        // the equivalent GMT datetime is set 
        // hence, it will work only if the system timezone is IST 
        var marketOpenTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 15, 0);
        var endOfFirstHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 15, 0);

        return now.isBetween(marketOpenTime, endOfFirstHour);
    }

    this.isPastFirstHour = function(){
        var now = new Date();      
        var endOfFirstHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 15, 0);
        return now.isAheadOf(endOfFirstHour);
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

