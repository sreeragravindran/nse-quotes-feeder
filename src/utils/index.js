// Date extensions

Date.prototype.getDiffInMinutesFrom = function(anotherDate){
    return Math.round((this.getTime() - anotherDate.getTime()) / 60000 ); 
}

Date.prototype.isBetween = function(startDate, endDate){
    if(this.getTime() >= startDate.getTime() && this.getTime() <= endDate.getTime()){
        return true;
    }
    return false;
}

// Object Array Extensions 

Array.prototype.max = function(key){
    return this.reduce((max, e) => e[key] > max ? e[key] : max, this[0][key])
}

Array.prototype.min = function(key){
    return this.reduce((min, e) => e[key] < min ? e[key] : min, this[0][key])
}

Array.prototype.sum = function(key){
    return this.reduce((sum, e) => sum + e[key], 0)
}

Math.toDecimal = function(value, decimalPlaces){ 
    if(value != null && parseFloat(value)){
        return parseFloat(value).toFixed(decimalPlaces);
    }
    return value;
}


//  var array = [ { 'id' : 1 }, { 'id' : 2 }, { 'id' : 3.2}]; 

//  console.log(array.sum('id'));

// console.log(array.max('id'));
// console.log(array.min('id'));

//  var models = require('../domain/models/index');

// var acc = new models.Stock('ACC'); 
// acc.priceVolumeSeries = [ 
//     new models.PriceVolumeData(new Date(), null, 1, 1, 1, 1 ), 
//     new models.PriceVolumeData(new Date(), 2, 2, 2, 2, 2 ),
//     new models.PriceVolumeData(new Date(), 3, 3, 3, 3, 3 ),  
// ]; 

// var result = acc.priceVolumeSeries.filter(e => e.open > 0);

//  console.log(result.length);

// var now = new Date();
// var sDate = new Date(2018, 5, 19, 15, 0 , 0); 
// var eDate = new Date(2018, 5, 19, 16, 0 , 0); 

// console.log(now.getMonth());
// console.log(sDate);
// console.log(eDate);

// console.log(now.isBetween(sDate, eDate));
