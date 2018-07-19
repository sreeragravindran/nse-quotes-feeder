const MODULE_ID = "SRC/DOMAIN/ALPHAVANTAGE/";
const config = require('../../../../config');
var models = require('../../models');
var IsMarketClosed; 

class AlphaVantage {
    constructor(apiKey) {
        const alpha = require("alphavantage")({ key: apiKey });
        this.data = alpha.data;
    }

    getAllStocks() {
        var stocks = [];
        var fs = require('fs');
        var symbols = fs.readFileSync('data/equities.top-picks.txt').toString().split("\n");
        symbols.forEach(s => {
            stocks.push(new models.Stock(s));
        });
        return stocks;
    }

    /**
     *
     * @param {Stock} stock
     * @param {function} callback
     */
    getIntraday1mSeriesForAStock(stock, callback) {
        //console.log('fetching for ', stock.symbol);
        if(isMarketOpen()){
            IsMarketClosed = false;
            this.data.intraday(stock.symbol, 'compact', 'json', '5min')
                .then(data => {
                    var timeSeries = data['Time Series (5min)'];
                    stock.priceVolumeSeries = [];
                    for (var key in timeSeries) {
                        if (timeSeries.hasOwnProperty(key)) {
                            stock.priceVolumeSeries.push(new models.PriceVolumeData(
                                key, 
                                timeSeries[key]['1. open'], 
                                timeSeries[key]['2. high'], 
                                timeSeries[key]['3. low'], 
                                timeSeries[key]['4. close'], 
                                timeSeries[key]['5. volume'])
                            );
                        }
                    }
                    return callback(null, stock);
                })
                .catch((error) => {
                    return callback({ stock: stock, errorMessage: error });
                });
            }
            else{
                if(!IsMarketClosed){
                    console.log(MODULE_ID, " marked is closed");
                    IsMarketClosed = true;
                }
            }
    }


    getIntraday1mSeriesForAllStocks(callback) {
        var stocks = this.getAllStocks();
        this.getIntraday1mSeriesForStocks(stocks, callback);
    }

    /**
     * 
     * @param {Array[Stocks]} stocks
     * @param {function} callback
     */
    // encapsulates the logic to regulate the calls to api for multiple stocks 
    // ensures a request is fired once every nth second 
    getIntraday1mSeriesForStocks(stocks, callback) {
        if (stocks && stocks.length > 0) {
            var index = 0;
            var alphaVantage = this;
            (function getData() {
                setTimeout(() => {
                    if(index < stocks.length){
                        //console.log(stocks[index].symbol)
                        alphaVantage.getIntraday1mSeriesForAStock(stocks[index], callback);
                        index++;
                        getData();            
                    }
                    else {
                        index = 0;
                        getData();
                    }
                }, config.alphaVantage.requestInterval);
            })();
        }
    }
}

function isMarketOpen(){
    if(config.alphaVantage.validateMarketHours){
        var now = new Date();
        var marketOpenTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 15, 0);
        var marketCloseTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 30, 0);
        return (now.getDay() > 0 && now.getDay() < 6 && now.isBetween(marketOpenTime, marketCloseTime));
    }
    return true;
}

module.exports = new AlphaVantage(config.alphaVantage.apiKey);

