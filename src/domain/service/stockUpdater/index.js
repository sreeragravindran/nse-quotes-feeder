const MODULE_ID = "SRC/DOMAIN/SERVICE/STOCKUPDATER";
const alphaVantage = require('../alphaVantage');
const models = require('../../models');
const db = require('../../../db');
const utils = require('../../../utils');
const IchimokuCalculator = require('../ichimokuCalculator');
const MoneyFlowCalculator = require('../moneyFlowCalculator');
const BreakSignal = "BreakSignal";

function updateStockQuotes(onUpdateCallback){
    alphaVantage.getIntraday1mSeriesForAllStocks(function(error, stock){

        if(error){
            //console.error(MODULE_ID, error); 
            return;
        }

        var now = new Date();
        var latestPrice = stock.getLatestPrice();
        
        if(latestPrice){
            db.models.LatestQuote.findOne({
                where : {symbol : stock.symbol}
            })
            .then(result => {
                if(result == null){
                    return insertQuote(stock); 
                } else { //if ( now.getDiffInMinutesFrom(result.updatedAt) >= 5 ){
                    return updateQuote(stock);
                }
                // exit chain here 
                return Promise.reject(BreakSignal);
            })
            .then(() => {
                 // update ichimoku indicators                     
                 return db.models.IntradayQuotes.findAll({
                     where : { symbol : stock.symbol }, 
                     attributes : ['id','symbol','high','low','open','close','volume', 'averagePrice', 'rawMoneyFlow', 'upOrDown', 'positiveMoneyFlow', 'negativeMoneyFlow'], 
                     order : [
                         ['createdAt', 'DESC'], 
                     ], 
                     limit : 52
                 }).then(priceHistory => {
                   // console.log("update Ichimoku indicators")
                    return updateIndicators(priceHistory);
                })        
            })
            .then((result) => {
                //console.log('sending update notification for ', stock.symbol)     
                onUpdateCallback(null, result);                                             
            })
            .catch((error) => {
                if(error != BreakSignal) {
                    console.error(MODULE_ID, "error: ", error);
                    onUpdateCallback(error, null);
                }
            })            
        }        
    })    
}


function insertQuote(stock){
    var latestPrice = stock.getLatestPrice();
    
    return insertIntradayQuote(stock).then(function(){
        return db.models.LatestQuote.create({
            symbol : stock.symbol,
            closingPrice : latestPrice.close
        });
    });
    
}

function updateQuote(stock){
    var latestPrice = stock.getLatestPrice();
    
    return insertIntradayQuote(stock).then(function(){
        return db.models.LatestQuote.update(
           { closingPrice : latestPrice.close }, 
           { where : 
                { symbol : stock.symbol } 
           } 
        );
    })    
}

function insertIntradayQuote(stock){
    var latestPrice = stock.getLatestPrice();
    return db.models.IntradayQuotes.create({ 
        symbol : stock.symbol, 
        timestamp : new Date(),
        open : latestPrice.open,
        high : latestPrice.high,
        low : latestPrice.low,
        close : latestPrice.close, 
        volume : latestPrice.volume
    })
}

function updateIndicators(priceHistory){

    var ichimokuIndicators = new IchimokuCalculator(priceHistory).getIndicators(); 
    var moneyFlowCalaculator = new MoneyFlowCalculator(priceHistory);
    var moneyFlowIndicators = moneyFlowCalaculator.getIndicators();
    var currentCandle = priceHistory[0];
    currentCandle.averagePrice = moneyFlowIndicators.averagePrice;
    currentCandle.upOrDown = moneyFlowIndicators.upOrDown;
    currentCandle.rawMoneyFlow = moneyFlowIndicators.rawMoneyFlow;
    currentCandle.positiveMoneyFlow = moneyFlowIndicators.positiveMoneyFlow;
    currentCandle.negativeMoneyFlow = moneyFlowIndicators.negativeMoneyFlow;
    
    var fourteenPeriodMFRatios = moneyFlowCalaculator.getRatiosForPeriod(14);

    return db.models.IntradayQuotes.update(
        { 
            conversionLine : ichimokuIndicators.conversionLine,
            baseLine : ichimokuIndicators.baseLine,
            leadingSpanA : ichimokuIndicators.leadingSpanA,
            leadingSpanB : ichimokuIndicators.leadingSpanB,
            averagePrice : moneyFlowIndicators.averagePrice,
            upOrDown : moneyFlowIndicators.upOrDown,
            rawMoneyFlow : moneyFlowIndicators.rawMoneyFlow,
            positiveMoneyFlow : moneyFlowIndicators.positiveMoneyFlow,
            negativeMoneyFlow : moneyFlowIndicators.negativeMoneyFlow
        },
        {   
            where : { id : priceHistory[0].id }
        }
    )
    .then(() => {
        var currentCandle = priceHistory[0];
        return {
            symbol : currentCandle.symbol,
            open : currentCandle.open,
            high : currentCandle.high,
            low : currentCandle.low,
            close : currentCandle.close, 
            volume : currentCandle.volume,
            conversionLine : ichimokuIndicators.conversionLine,
            baseLine : ichimokuIndicators.baseLine,
            leadingSpanA : ichimokuIndicators.leadingSpanA,
            leadingSpanB : ichimokuIndicators.leadingSpanB,
            averagePrice : moneyFlowIndicators.averagePrice,
            upOrDown : moneyFlowIndicators.upOrDown,
            rawMoneyFlow : moneyFlowIndicators.rawMoneyFlow,
            positiveMoneyFlow : moneyFlowIndicators.positiveMoneyFlow,
            negativeMoneyFlow : moneyFlowIndicators.negativeMoneyFlow,
            fourteenPeriodMFRatio : fourteenPeriodMFRatios.MoneyFlowRatio,
            fourteenPeriodMFIndex : fourteenPeriodMFRatios.MoneyFlowIndex 
        }
    })
}

module.exports = {
    updateStockQuotes : updateStockQuotes
}