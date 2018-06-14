
function IchimokuCloudViewModel(){
    this.symbol = '';
    this.conversionLine = '';
    this.baseLine = '';
    this.cloud = '';
}

IchimokuCloudViewModel.prototype.mapFrom = function(data){
    this.symbol = data.symbol;
    this.conversionLine = getConversionLine(data.low, data.high, data.conversionLine);
    this.baseLine = getBaseLine(data.low, data.high, data.baseLine);
}

function getConversionLine(low, high, conversionLine){
    if(low > conversionLine){
        return "Above Blue"; 
    }
    if(high < conversionLine){
        return "Below Blue";
    }
    return "";
}

function getBaseLine(low, high, baseLine){
    if(low > baseLine){
        return "Above Red";
    }
    if(high < baseLine){
        return "Below Red";
    }
    return "";
}


module.exports = IchimokuCloudViewModel;