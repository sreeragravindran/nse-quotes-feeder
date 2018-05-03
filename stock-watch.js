//var stockWatch = require("stock-watch"); 

import Fetcher from 'stock-watch'; 

module.exports = { 
    getStockPrice : function(symbol, callback){
        Fetcher.getRealtime('MARUTI').then(
            (result) => {
                //console.log(result); 
                callback(result); 
            }, 
            (error) => {
                console.error(error);
            }
        ); 
    }
}