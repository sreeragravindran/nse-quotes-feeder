var googleFinance = require('google-finance'); 

var SYMBOL = 'NASDAQ:AAPL';
var FROM = '2014-01-01';
var TO = '2014-12-31';

googleFinance.historical({
    symbol : SYMBOL,
    from: FROM , 
    to: TO, 
}, function(error, quotes){
    if(error){
        console.error("error occured while fetching historical quotes", error);
        return; 
    }
    console.log("fetched quotes");
    console.log(quotes.length);
})
