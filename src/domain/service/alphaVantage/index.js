const MODULE_ID = "SRC/DOMAIN/ALPHAVANTAGE/";
const config = require('../../../../config');
const stockExchange = require('../stockExchange');
var models = require('../../models');
var IsMarketClosed; 

class AlphaVantage {
    constructor(apiKey) {
        const alpha = require("alphavantage")({ key: apiKey });
        this.data = alpha.data;
    }
    
    /**
     *
     * @param {Stock} stock
     * @param {function} callback
     */
    getIntraday1mSeriesForAStock(stock, callback) {
        //console.log('fetching for ', stock.symbol);
        if(!config.alphaVantage.validateMarketHours || stockExchange.isOpen()){
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
        var stocks = stockExchange.getAllStocks();
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

module.exports = new AlphaVantage(config.alphaVantage.apiKey);

