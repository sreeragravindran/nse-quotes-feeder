const alpha = require("alphavantage")({key : '3FUAI09JYAO19WCX'}); 
const fs = require('fs');

function StockExchange(equities){   
    this.equities = equities;
    this.successCount = 0;
    this.failureCount = 0;
    this.index = 0;
}

StockExchange.prototype.getCurrentPrices = function(callback){
    
    setTimeout(() => {
        if (this.index < this.equities.length){
            getCurrentPrice(this.equities[this.index])
            this.index++;
            this.getCurrentPrices(callback); 
        }
    }, 5000); 

    function getCurrentPrice(stockSymbol){
        // console.log("fetching data for:", stockSymbol);        
        alpha.data.intraday(stockSymbol,'compact','json','1min')
        .then(data => {
            this.totalCount++; 

            var timeSeries = data['Time Series (1min)']; 
            var currentPrice = {};
            for(var key in timeSeries){
                if(timeSeries.hasOwnProperty(key)){
                    currentPrice = {
                        stockSymbol : stockSymbol,
                        timestamp : key,                     
                        open : timeSeries[key]['1. open'],
                        high : timeSeries[key]['2. high'],
                        low : timeSeries[key]['3. low'],
                        close: timeSeries[key]['4. close'],
                        volume: timeSeries[key]['5. volume']
                    };                     
                    this.successCount++;                     
                    
                    // break after reading the first element (for latest value) in the time series 
                    break;                       
                }
            }
            return callback(currentPrice);                 
        })        
        .catch((error) => {
            this.totalCount++; 
            this.failureCount++;             
            return callback(null, {stockSymbol : stockSymbol, errorMessage: error});
        })  
    }

}

var stocks = fs.readFileSync('equities.txt').toString().split("\n");

var stockExchange = new StockExchange(stocks); 

stockExchange.getCurrentPrices(function(data, error){
    if(error){
        console.error(error.stockSymbol, error.errorMessage)
    }else {
        console.log(data.stockSymbol, data.close);
    }
});

//console.log("END !!");

// setInterval(() => { 
//     successCount = 0; 
//     updateStockPrices();
// }, 1000 * 60);