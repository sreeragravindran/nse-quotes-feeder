function PriceVolumeData(timestamp, open, high, low, close, volume){
    this.timestamp = timestamp;
    this.open = open;
    this.high = high;
    this.low = low;
    this.close = close;
    this.volume = volume;
}

PriceVolumeData.prototype.getAveragePrice = function(){
    return (this.high + this.low + this.close) / 3; 
}

function Stock(symbol){
    this.symbol = symbol; 
    this.priceVolumeSeries = []; 
}

Stock.prototype.getLatestPrice = function(){
    if(this.priceVolumeSeries.length > 0){
        return this.priceVolumeSeries[0];
    }
    return null;
}

function FirstHourBreakOut(high = null, low = null, highBreakOutTime = null, lowBreakOutTime = null){
    this.high = high;
    this.low = low;
    this.highBreakOutTime = highBreakOutTime;
    this.lowBreakOutTime = lowBreakOutTime;
}

FirstHourBreakOut.prototype.isHighAndLowPresent = function(){
    if(this.high && this.low){
        return true;
    }
    return false;
}

FirstHourBreakOut.prototype.isHighBreakOutPresent = function(){
    if(this.highBreakOutTime){
        return true;
    }
    return false;
}

FirstHourBreakOut.prototype.isLowBreakOutPresent = function(){
    if(this.lowBreakOutTime){
        return true;
    }
    return false;
}

module.exports.Stock = Stock;
module.exports.PriceVolumeData = PriceVolumeData;

//console.log(new FirstHourBreakOut());