function PriceVolumeData(timestamp, open, high, low, close, volume){
    this.timestamp = timestamp;
    this.open = open;
    this.high = high;
    this.low = low;
    this.close = close;
    this.volume = volume;
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

PriceVolumeData.prototype.getAveragePrice = function(){
    return (this.high + this.low + this.close) / 3; 
}

module.exports.Stock = Stock;
module.exports.PriceVolumeData = PriceVolumeData;

// 