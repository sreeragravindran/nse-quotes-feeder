function doSomething(){
    return new Promise(function(resolve, reject){
        setTimeout(() => {
            resolve("data-from-doSomething");
        }, 2000)
    })
}

function getSomething() {
    return new Promise(function(resolve, reject){
            setTimeout(() => {
                doSomething()
                .then(result => {
                    console.log(result);
                    if(result == "data-from-doSomething"){
                        return resolve("data-from-getSomething");
                    } else {
                        return result;
                    }
                })
                .then(result => {
                    //console.log(result, "from then innermost then in getSomething")
                    resolve(result);
                })                
            }, 2000);
    }).then(data => {
        console.log(data, "from outer most then in getSomething")
        return data;
    })
}

if(1 ==1 ){
    getSomething().then(result => {
        console.log(result, "from second then");
        return result;
    })
}

console.log("end of program");