/**
 * Created by Suchishree Jena on 11/7/2017.
 */

var express = require('express');
var router = express.Router();
var assert = require('assert');
var Customer = require('../models/customer');
var Items = require('../models/item');
var Order = require('../models/order');


/* GET home page. */
router.get('/',function (req,res) {
    res.render('index');
});

router.get('/getVoucherDetails',function (req,res) {
    console.log("*************In Server side *****************")
    Items.find(function(err, result) {
        if (err) throw err;
        res.send({vouchers: result });
    })
});


router.get('/getTransactionDetails/:userid',function (req,res) {
    var user = req.params.userid;
    console.log("searching for data");

console.log ("User is",user);
    Order.find({ "userid": user})
        .exec(function(err, result) {
        if (err) throw err;
        console.log("Result is",result);
        res.send({orders: result});
    });
});

router.post('/userSignup',function (req,res) {
    var customerData = new Customer({
        fname: req.body.firstName,
        lname: req.body.lastName,
        username: req.body.userName,
        password: req.body.password,
        email: req.body.email,
        phone: req.body.phone
    });
    console.log("user sign up");
    customerData.save(function (err,result) {
       if(err){
           res.json({msg: 'Failed to add Customer details'});
           console.log(err);
       }
       else{
           res.json({msg: 'Customer details saved successfully'});
           console.log(result);
       }
    });
});



router.get('/getData/',function (req,res,next) {

        Customer.find(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result);
        })
});

router.post('/login',function (req,res,next) {
            var uname = req.body.userName;
            var pass = req.body.password;
            Customer.findOne({username:uname, password:pass}, function(err, result) {
                if (err) throw err;
                if(!result){
                    res.statusCode = 401;
                    res.send("Invalid Username or Password");
                } else {
                    res.json(result);
                    
                }
            })
    });

router.post('/redeemCoupon', function(req, res) {
// console.log(req.body);

    var orderData = new Order({
        userid: req.body.userid,
        items: req.body.voucherName,
        orderDate: req.body.date,
        points: req.body.points,
        value : req.body.value
     });

    console.log("Coupon Redeemed");
    orderData.save(function (err,result) {
       if(err){
           res.json({msg: 'Failed to add Order details'});
           console.log(err);
       }
       else{
           res.json({msg: 'Order details saved successfully'});
           console.log(result);
       }
    });
});

router.get('/deleteData/:id', function(req, res) {

    Customer.remove({_id: req.params.id}, function (err,result) {
        if(err){
            res.json(err);
        }
        else{
            res.json(result);
        }
    });
});


router.post('/addItem',function (req,res) {
    var itemData = new Items({
        voucherName: req.body.voucherName,
        points: req.body.points,
        value: req.body.value,
        voucherCode: req.body.voucherCode
    });

    console.log("Adding an Item");
    itemData.save(function (err,result) {
       if(err){
           res.json({msg: 'Failed to add details'});
           console.log(err);
       }
       else{
           res.json({msg: 'Details saved successfully'});
           console.log(result);
       }
    });
});



module.exports = router;
