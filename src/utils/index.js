// Date extensions

Date.prototype.getDiffInMinutesFrom = function(anotherDate){
    return Math.round((this.getTime() - anotherDate.getTime()) / 60000 ); 
}


// Object Array Extensions 

Array.prototype.max = function(key){
    return this.reduce((max, e) => e[key] > max ? e[key] : max, this[0][key])
}

Array.prototype.min = function(key){
    return this.reduce((min, e) => e[key] < min ? e[key] : min, this[0][key])
}


// var array = [ { 'id' : 1 }, { 'id' : 2 }, { 'id' : 3}]; 

// console.log(array.max('id'));
// console.log(array.min('id'));

// var models = require('../domain/models/index');

// var acc = new models.Stock('ACC'); 
// acc.priceVolumeSeries = [ 
//     new models.PriceVolumeData(new Date(), 1, 1, 1, 1, 1 ), 
//     new models.PriceVolumeData(new Date(), 2, 2, 2, 2, 2 ),
//     new models.PriceVolumeData(new Date(), 3, 3, 3, 3, 3 ),  
// ]; 

// console.log(acc.priceVolumeSeries.max('high'));