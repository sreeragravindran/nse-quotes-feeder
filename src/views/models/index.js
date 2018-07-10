
function IchimokuCloudViewModel(){
    this.symbol = '';
    this.open = '';
    this.high = '';
    this.low = '';
    this.close = '';
    this.conversionLine = '';
    this.baseLine = '';
    this.cloud = '';
    this.fourteenPeriodMFRatio = '';
    this.fourteenPeriodMFIndex = '';
}

IchimokuCloudViewModel.prototype.mapFrom = function(candleData){
    this.symbol = candleData.symbol;
    this.open = candleData.open;
    this.high = candleData.high;
    this.low = candleData.low;
    this.close = candleData.close;
    this.conversionLine = getConversionLine(candleData.low, candleData.high, candleData.conversionLine);
    this.baseLine = getBaseLine(candleData.low, candleData.high, candleData.baseLine);
    this.cloud = getWhereInCloud(candleData);
    this.fourteenPeriodMFIndex = candleData.fourteenPeriodMFIndex;
    this.fourteenPeriodMFRatio = candleData.fourteenPeriodMFIndex;
    return this;
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
    if(notNull(low, high, baseLine)){
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