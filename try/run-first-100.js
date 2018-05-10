var AlphaVantage = require('../src/domain/alpha-vantage');

var alphaVantage = new AlphaVantage('3FUAI09JYAO19WCX');

var allStocks = alphaVantage.getAllStocks(); 

alphaVantage.getIntraday1mSeriesForStocks(allStocks, function(error, data){
    if(error){
        //console.log(error.stock.symbol, error.errorMessage);
    }
    else{
        console.log(data.symbol, data.priceVolumeSeries[0].close);
    }
});