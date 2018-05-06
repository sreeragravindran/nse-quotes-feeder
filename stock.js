function PriceVolumeData(timestamp, open, high, low, close, volume){
    this.timestamp = timestamp;
  
    this.open = open;
    this.high = high;
    this.low = low;
    this.close = close;
    this.volume = volume;
}

function Stock(symbol){
    this.symbol = symbol; 
    this.priceVolumeSeries = []; 
}

class AlphaVantage {
    constructor(apiKey) {
        const alpha = require("alphavantage")({ key: apiKey });
        this.data = alpha.data;
    }

    getAllStocks() {
        var stocks = [];
        var fs = require('fs');
        var symbols = fs.readFileSync('equities.txt').toString().split("\n");
        symbols.forEach(s => {
            stocks.push(new Stock(s));
        });
        return stocks;
    }

    /**
     *
     * @param {Stock} stock
     * @param {function} callback
     */
    getIntraday1mSeriesForAStock(stock, callback) {
        this.data.intraday(stock.symbol, 'compact', 'json', '1min')
            .then(data => {
                var timeSeries = data['Time Series (1min)'];
                for (var key in timeSeries) {
                    if (timeSeries.hasOwnProperty(key)) {
                        stock.priceVolumeSeries.push(new PriceVolumeData(
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
                    alphaVantage.getIntraday1MSeriesFor(stocks[index], callback);
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
                        alphaVantage.getIntraday1mSeriesForAStock(stocks[index], callback);
                        index++;
                        getData();            
                    }
                }, 3000);
            })();
        }
    }
}


var aV1 = new AlphaVantage('3FUAI09JYAO19WCX');
var aV2 = new AlphaVantage('D11MRXG1OJVDIBYU')

var allStocks = aV1.getAllStocks(); 


var first100 = allStocks.slice(0, 100);
var second100 = allStocks.slice(100, 200);


aV1.getIntraday1mSeriesForStocks(first100, function(error, data){
    if(error){
        console.log(error.stock.symbol, error.errorMessage);
    }
    else{
        console.log(data.symbol, data.priceVolumeSeries[0].close);
    }
});

// aV2.getIntraday1mSeriesForStocks(second100, function(error, data){
//     if(error){
//         console.log(error.stock.symbol, error.errorMessage);
//     }
//     else{
//         console.log(data.symbol, data.priceVolumeSeries[0].close);
//     }
// });