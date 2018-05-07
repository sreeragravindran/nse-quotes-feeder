
//date time 

// var moment = require('moment-timezone'); 
// var time = require('time'); 

// //momemtDate.tz("America/New_York")

// var now = moment.tz("2018-05-02 02:50:00","America/New_York"); 

// console.log(now.local().format());
//console.log(now+1);

// promise  

wait = (time) => new Promise((resolve) => setTimeout(() => resolve(), time)); 

wait(1000)
.then(() => {
    return new Promise((resolve) => {        
        setTimeout(() => {
            console.log("hello"); 
            resolve()
        }, 1000)
    })    
})
.then(() => console.log("world"));


// // this in method when invoked from closure 
// function Person(name){
//     this.name = name;
// }

// Person.prototype.getName = function(){
//     console.log(this);
//     return this.name; 
// }

// Person.prototype.getData = function(){
//     //var getName = this.getName;    
//     var that = this;

//     getNameClosure = function(){
//         console.log(that.getName());
//     };

//     getNameClosure();
// }

// var p = new Person('mike');
// //p.getName()
// // console.log();
// p.getData();

var alpha = require('../src/domain/alpha-vantage');

alpha();