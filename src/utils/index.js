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

Date.prototype.isAheadOf = function(anotherDate){
    return this.getTime() > anotherDate.getTime();
}

Date.prototype.addHours = function(h) {   
    var newDate = new Date(this); 
    newDate.setTime(this.getTime() + (h*60*60*1000)); 
    return newDate;   
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

// String extensions 

String.prototype.format = function() {
    var args = [].slice.call(arguments, 0); 
    var i = 0;

    return this.toString().replace(/%s/g, function() {
        return args[i++];
    });
}


// Console extensions 

// console.prototype.logError = function(moduleId, error){
//     console.error("ERROR ", moduleId, (new Date()).toISOString(), error);
// }

// console.prototype.logInfo = function(moduleId, info){
//     console.log("INFO ", moduleId, (new Date()).toISOString(), info);
// }

//  var array = [ { 'id' : 1 }, { 'id' : 2 }, { 'id' : 3.2}]; 

//  console.log(array.sum('id'));

// console.log(array.max('id'));
// console.log(array.min('id'));

//  var models = require('../domain/models/index');

// var acc = new models.Stock('ACC'); 
// acc.priceVolumeSeries = [ 
//     // new models.PriceVolumeData(new Date(), null, 1, 1, 1, 1 ), 
//     // new models.PriceVolumeData(new Date(), 2, 2, 2, 2, 2 ),
//     // new models.PriceVolumeData(new Date(), 3, 3, 3, 3, 3 ),  
// ]; 


// console.log(acc.priceVolumeSeries.max('high'));

// var result = acc.priceVolumeSeries.filter(e => e.open > 0);

//  console.log(result.length);

// var now = new Date();
// var sDate = new Date(2018, 5, 19, 15, 0 , 0); 
// var eDate = new Date(2018, 5, 19, 16, 0 , 0); 

// console.log(now.getMonth());
// console.log(sDate);
// console.log(eDate);

// console.log(now.isBetween(sDate, eDate));
