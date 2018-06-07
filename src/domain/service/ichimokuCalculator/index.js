const MODULE_ID = "SRC/DOMAIN/SERVICE/ICHIMOKUCALCULATOR";

function IchimokuIndicators(){
   this.conversionLine = null;
   this.baseLine = null; 
}

function getIndicators(priceHistory){
    //console.log(MODULE_ID, "getIndicators");
    var indicators = new IchimokuIndicators();

    if(priceHistory && priceHistory.length >= 9){

        indicators.conversionLine = getConversionLine(priceHistory);
        
        if(priceHistory.length >= 26){
            indicators.baseLine = getBaseLine(priceHistory);
        }
    }

    return indicators; 
    //console.log(MODULE_ID, indicators);
}


function getConversionLine(priceHistory){
    //console.log(MODULE_ID, "getConversionLine");
    return getMidPoint(priceHistory.slice(0,9)); 

}

function getBaseLine(priceHistory){
    //console.log(MODULE_ID, "getBaseLine");
    return getMidPoint(priceHistory.slice(0,26));
}

function getMidPoint(priceHistory){
    //console.log(MODULE_ID, "getMidPoint");
    var periodHigh = priceHistory.max('high');                            
    var periodLow = priceHistory.min('low');                        
    return(periodHigh + periodLow) / 2.0 ;
}


module.exports = {
    getIndicators : getIndicators
}; 
//console.log(new IchimokuIndicators().baseLine);