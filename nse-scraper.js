var rp = require('request-promise');
var cheerio = require('cheerio');
var fs = require('fs');
var url = 'https://www.nseindia.com/live_market/dynaContent/live_watch/get_quote/GetQuote.jsp?'; 

var equities = fs.readFileSync('equities.txt').toString().split("\n");

// console.log(equities)
var options = {
    uri : url + 'symbol=maruti&illiquid=0&smeFlag=0&itpFlag=0',
    transform : function(body){
        cheerio.load(body)
    }
}

rp(options).then(function($){
    console.log($("#responseDiv"))
})
.catch(function(error){
    console.error(error);
}) 