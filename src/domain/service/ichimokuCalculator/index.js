const MODULE_ID = "SRC/DOMAIN/SERVICE/ICHIMOKUCALCULATOR";

function IchimokuIndicators(){
   this.conversionLine = null;
   this.baseLine = null; 
   this.leadingSpanA = null; 
   this.leadingSpanB = null;
}

function IchimokuCalculator(priceHistory){
    this.priceHistory = priceHistory;       
}

IchimokuCalculator.prototype.getIndicators = function(){
    //console.log(MODULE_ID, "getIndicators");
    var indicators = new IchimokuIndicators();
    if(this.priceHistory && this.priceHistory.length >= 9){
        indicators.conversionLine = Math.toDecimal(this.getConversionLine(), 2);
        indicators.baseLine = Math.toDecimal(this.getBaseLine(), 2);
        indicators.leadingSpanA = Math.toDecimal(this.getLeadingSpanA(), 2);
        indicators.leadingSpanB = Math.toDecimal(this.getLeadingSpanB(), 2);
    }
    return indicators;
    //console.log(MODULE_ID, indicators);
}

IchimokuCalculator.prototype.getConversionLine = function(){
    //console.log(MODULE_ID, "getConversionLine");
    if(this.priceHistory.length >= 9 )
        return getMidPoint(this.priceHistory.slice(0,9)); 
    return null;
}

IchimokuCalculator.prototype.getBaseLine = function(){
    //console.log(MODULE_ID, "getBaseLine");
    if(this.priceHistory.length >= 26)
        return getMidPoint(this.priceHistory.slice(0,26));
    return null;
}

IchimokuCalculator.prototype.getLeadingSpanA = function(){
    var conversionLine = this.getConversionLine();
    var baseLine = this.getBaseLine();
    if(conversionLine == null || baseLine == null)
        return null; 
    return ((conversionLine + baseLine) / 2.0);
}

IchimokuCalculator.prototype.getLeadingSpanB = function(){
    if(this.priceHistory.length >= 52)
        return getMidPoint(this.priceHistory.slice(0,52));
    return null;
}

function getMidPoint(priceHistory){
    //console.log(MODULE_ID, "getMidPoint");
    var periodHigh = priceHistory.max('high');                            
    var periodLow = priceHistory.min('low');                        
    return(periodHigh + periodLow) / 2.0 ;
}

module.exports = IchimokuCalculator;