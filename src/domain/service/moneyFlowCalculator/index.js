const MODULE_ID = "SRC/DOMAIN/SERVICE/MONEYFLOWCALCULATOR";

function MoneyFlowIndicators(){
    this.averagePrice = null;
    this.upOrDown = null; 
    this.rawMoneyFlow = null;
    this.positiveMoneyFlow = null;
    this.negativeMoneyFlow = null;
}

function MoneyFlowRatios(){
    this.MoneyFlowRatio = null;
    this.MoneyFlowIndex = null;
}
// priceHistory is array of IntradayQuotes 
function MoneyFlowCalculator(priceHistory){
    this.priceHistory = priceHistory;
}

MoneyFlowCalculator.prototype.getIndicators = function(){
    // calculate intraday quotes
    if(!this.priceHistory || this.priceHistory.length == 0)
        return; 

    var indicators = new MoneyFlowIndicators();
    var currentCandle = this.priceHistory[0]; 
    indicators.averagePrice = (currentCandle.high + currentCandle.low + currentCandle.close) / 3; 

    if(this.priceHistory.length >= 2){
        // calculate rest of the metrics 
        var previousCandle = this.priceHistory[1];
        indicators.upOrDown = indicators.averagePrice > previousCandle.averagePrice ? 1 : -1;
        indicators.rawMoneyFlow = indicators.averagePrice * currentCandle.volume;
        indicators.positiveMoneyFlow = indicators.upOrDown > 0 ? indicators.rawMoneyFlow : 0; 
        indicators.negativeMoneyFlow = indicators.upOrDown < 0 ? indicators.rawMoneyFlow : 0;
    }
    
    return indicators;
}

MoneyFlowCalculator.prototype.getRatiosForPeriod = function(period){
    var moneyFlowRatios = new MoneyFlowRatios();
    if( !this.priceHistory || this.priceHistory.length < period)
        return moneyFlowRatios;
    
    var periodData = this.priceHistory.slice(0, period);
    if(periodDataIsValid(periodData, period) ) {
        var periodPositiveMoneyFlow = periodData.sum('positiveMoneyFlow');
        var periodNegativeMoneyFlow = periodData.sum('negativeMoneyFlow');
        moneyFlowRatios.MoneyFlowRatio = periodPositiveMoneyFlow / periodNegativeMoneyFlow; 
        moneyFlowRatios.MoneyFlowIndex = 100 - (100/(1+moneyFlowRatios.MoneyFlowRatio));
    }
    return moneyFlowRatios;  
}

function periodDataIsValid(periodData, period){
    return periodData.filter(e => (e.positiveMoneyFlow != null && e.negativeMoneyFlow != null)).length >= period;
}

module.exports = MoneyFlowCalculator;