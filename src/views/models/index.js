
function IchimokuCloudViewModel(){
    this.symbol = '';
    this.conversionLine = '';
    this.baseLine = '';
    this.cloud = '';
}

IchimokuCloudViewModel.prototype.mapFrom = function(candleData){
    this.symbol = candleData.symbol;
    this.conversionLine = getConversionLine(candleData.low, candleData.high, candleData.conversionLine);
    this.baseLine = getBaseLine(candleData.low, candleData.high, candleData.baseLine);
    this.cloud = getWhereInCloud(candleData);
}

function getConversionLine(low, high, conversionLine){
    if(notNull(low, high, conversionLine)){
        if(low > conversionLine){
            return "ABOVE BLUE"; 
        }
        if(high < conversionLine){
            return "BELOW BLUE";
        }
    }
    return "";
}

function getBaseLine(low, high, baseLine){
    if(notNull(low, high, conversionLine)){
        if(low > baseLine){
            return "ABOVE RED";
        }
        if(high < baseLine){
            return "BELOW RED";
        }
    }
    return "";
}

function getWhereInCloud(data){
    if(notNull(data.leadingSpanA, data.leadingSpanB, data.low, data.high)){
        var cloudUpperBoundary = Math.max(data.leadingSpanA, data.leadingSpanB); 
        var cloudLowerBoundary = Math.min(data.leadingSpanA, data.leadingSpanB); 

        if (data.low > cloudUpperBoundary){
            return "ABOVE CLOUD"; 
        }
        if(data.high < cloudLowerBoundary){
            return "BELOW CLOUD"; 
        }
        if(data.high < cloudUpperBoundary && data.low > cloudLowerBoundary){
            return "WITHIN CLOUD";
        }
    }
    return "";
}

function notNull(){
    for(var i=0; i<arguments.length; i++){
        if(arguments[i] == null){
            return false;
        }
    }
    return true;
}

module.exports = {
    IchimokuCloudViewModel : IchimokuCloudViewModel
}