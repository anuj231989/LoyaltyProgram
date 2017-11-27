var Order = require('../models/order');

var mongoose = require('mongoose');

mongoose.connect('localhost:27017/loyalty');
console.log("Connected to MongoDb database");

var orders = [
    new Order({
        userid: "5a192f7700482fbb01af614a",
        items: "5a1958db16b8e0ac65fc8f89",
        orderDate: "12/01/2017",
        pointsRedeemed :100
    })
];

var done = 0;
for(var i=0; i<orders.length; i++){
    orders[i].save(function(err,result) {
        done++;
        if(done === orders.length){
            exit();
        }
    });
}

function exit() {
    console.log("Disconnected from Mongodb");
    mongoose.disconnect();
}