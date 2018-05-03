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

StockExchange.prototype.getIntraday1MSeriesForAllStocks = function(callback){   

    var stocks = this.getAllStocks();
    var index = 0;
    var getIntraday1MSeriesFor = this.getIntraday1MSeriesFor;

    (function getData(){     
        setTimeout(() => {
            if (index < stocks.length){                
                getIntraday1MSeriesFor(stocks[index], callback)                
                index++;              
                getData(); 
            }
        }, 1000);         
    })();    
}


var stockEx = new StockExchange();
console.log(stockEx.data);


//stockEx.getIntraday1MSeries(null, null); 
stockEx.getIntraday1MSeriesForAllStocks(function(error, data){
    if(error){
        console.log(error.stock.symbol, error.errorMessage);
    }
    else{
        console.log(data.symbol, data.priceVolumeSeries.length);
    }
});

