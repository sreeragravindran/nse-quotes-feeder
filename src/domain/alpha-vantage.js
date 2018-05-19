var models = require('./models');

class AlphaVantage {
    constructor(apiKey) {
        const alpha = require("alphavantage")({ key: apiKey });
        this.data = alpha.data;
    }

    getAllStocks() {
        var stocks = [];
        var fs = require('fs');
        var symbols = fs.readFileSync('data/equities.picks.txt').toString().split("\n");
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
        this.data.intraday(stock.symbol, 'compact', 'json', '1min')
            .then(data => {
                var timeSeries = data['Time Series (1min)'];
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

    // encapsulates the logic to regulate the calls to api for multiple stocks 
    // ensures a request is fired once every nth second 
    getIntraday1mSeriesForAllStocks(callback) {
        var stocks = this.getAllStocks();
        var index = 0;
        // hold a reference to the stock exchange object to be used inside the closure instead of 'this'    
        var alphaVantage = this;
        (function getData() {
            setTimeout(() => {
                if (index < stocks.length) {
                    alphaVantage.getIntraday1mSeriesForAStock(stocks[index], callback);
                    index++;
                    getData();
                }
            }, 3000);
        })();
    }

    /**
     *
     * @param {Array[Stocks]} stocks
     * @param {function} callback
     */
    getIntraday1mSeriesForStocks(stocks, callback) {
        if (stocks && stocks.length > 0) {
            var index = 0;
            var alphaVantage = this;
            (function getData() {
                setTimeout(() => {
                    if(index < stocks.length){
                        //console.log(stocks[index].symbol)
                        //alphaVantage.getIntraday1mSeriesForAStock(stocks[index], callback);
                        index++;
                        getData();            
                    }
                    else {
                        index = 0;
                        getData();
                    }
                }, 3000);
            })();
        }
    }
}


module.exports = new AlphaVantage('D11MRXG1OJVDIBYU');