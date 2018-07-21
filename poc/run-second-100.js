var AlphaVantage = require('../src/domain/alpha-vantage');

var alphaVantage = new AlphaVantage('D11MRXG1OJVDIBYU')

var allStocks = alphaVantage.getAllStocks(); 

alphaVantage.getIntraday1mSeriesForStocks(allStocks.slice(100, 200), function(error, data){
    if(error){
        console.log(error.stock.symbol, error.errorMessage);
    }
    else{
        console.log(data.symbol, data.priceVolumeSeries[0].close);
    }
});