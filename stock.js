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

function StockExchange(){
    const alpha = require("alphavantage")({key : '3FUAI09JYAO19WCX'}); 
    this.data = alpha.data;   
}

StockExchange.prototype.getAllStocks = function(){
    var stocks = [];
    var fs = require('fs');
    var symbols = fs.readFileSync('equities.txt').toString().split("\n");
    symbols.forEach(s => {
        stocks.push(new Stock(s));
    })
    return stocks;    
}

StockExchange.prototype.getIntraday1MSeriesFor = function(stock, callback){
    
    this.data.intraday(stock.symbol,'compact','json','1min')
        .then(data => {
            var timeSeries = data['Time Series (1min)']; 
            for(var key in timeSeries){
                if(timeSeries.hasOwnProperty(key)){
                    stock.priceVolumeSeries.push(new PriceVolumeData(
                        key,                     
                        timeSeries[key]['1. open'],
                        timeSeries[key]['2. high'],
                        timeSeries[key]['3. low'],
                        timeSeries[key]['4. close'],
                        timeSeries[key]['5. volume']
                    ))
                }
            }
            return callback(null, stock);                 
        })        
        .catch((error) => {
            return callback({stock : stock, errorMessage: error});
        })  

}

// encapsulates the logic to regulate the calls to api for multiple stocks 
// ensures a request is fired once every nth second 
StockExchange.prototype.getIntraday1MSeriesForAllStocks = function(callback){   

    var stocks = this.getAllStocks();
    var index = 0;
    // hold a reference to the stock exchange object to be used inside the closure instead of 'this'    
    var stockExchange = this;

    (function getData(){     
        setTimeout(() => {
            if (index < stocks.length){                
                stockExchange.getIntraday1MSeriesFor(stocks[index], callback)                
                index++;              
                getData(); 
            }
        }, 3000);         
    })();    
}


var stockEx = new StockExchange();

stockEx.getIntraday1MSeriesForAllStocks(function(error, data){
    if(error){
        console.log(error.stock.symbol, error.errorMessage);
    }
    else{
        console.log(data.symbol, data.priceVolumeSeries[0].close);
    }
});