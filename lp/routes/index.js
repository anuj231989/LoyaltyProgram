/**
 * Created by Suchishree Jena on 11/7/2017.
 */

var express = require('express');
var router = express.Router();
var assert = require('assert');
var Customer = require('../models/customer');
var Items = require('../models/item');
var Order = require('../models/order');
var nodemailer = require('nodemailer');


/* GET home page. */
router.get('/',function (req,res) {
    res.render('index');
});

router.get('/getVoucherDetails',function (req,res) {
    //console.log("*************In Server side *****************")
    Items.find(function(err, result) {
        if (err) throw err;
        res.send({vouchers: result });
    })
});

// router.post('/getPoints',function (req,res) {
//     //console.log("*************In Server side *****************")
//     console.log(req.body.id);
    
//     Order.find({ "userid": req.body.id})
//         .exec(function(err, result) {
//         if (err) throw err;

//         var totalPoints = 0;
//         for(var i=0;i<result.length;i++){
//             console.log(result[i].points);
//             if(typeof result[i].points != 'undefined'){
//                 totalPoints += Number(result[i].points);
//             }
//         }
//        res.send({'totalPoints' : totalPoints});
//     });

// });


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
           //res.json({msg: 'Customer details saved successfully'});
           if(req.body.emailId == "") {
               res.send("Error: Email should not blank");
               return false;
           }

           var smtpTransport = nodemailer.createTransport({
               service: 'Gmail',
               host: "smtp.gmail.com", // hostname
               secureConnection: true, // use SSL
               port: 465, // port for secure SMTP
               auth: {
                   user: "suchishree.jena29@gmail.com",
                   pass: "xsw2!QAZ"
               },
               tls: {
                   // do not fail on invalid certs
                   rejectUnauthorized: false
               }
           });
           var mailOptions = {
               from: "Digital Loyalty Program Emailer ✔ <suchishree.jena29@gmail.com>",// sender address
               to: req.body.email, // list of receivers
               subject: "Signup Successfull ✔", // Subject line
               html: "<b>Thank you for signing up for Digital Loyalty Program ☺</b><br/>Here are your details:<br/><br/><b>Username:</b>"+req.body.userName+" <br/><br/><b>Your Password:</b>"+req.body.password // html body
           }
           smtpTransport.sendMail(mailOptions, function(error, response){
               if(error){
                   console.log("Error in email"+error);
                   res.send("Email could not sent due to error: "+error);
               }else{
                   console.log(result);
                   console.log("Mail sent successfully");
                   res.send("Email has been sent successfully");
               }
           });

       }
    });


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

    var orderData = new Order({
        userid: req.body.userid,
        items: req.body.voucherName,
        orderDate: req.body.date,
        points: req.body.points,
        value : req.body.value
    });

     Customer.find({"_id": orderData.userid},function(err,doc) {
        if (err) { throw err; }
        else { 
            console.log("Document is..", doc[0]);
            console.log("Document is..", doc[0].totalPoints);
            var points = doc[0].totalPoints;
            var remainingPoints = points - orderData.points;
            console.log("Remaining Points are",remainingPoints);

            Customer.findOneAndUpdate({"_id": orderData.userid}, {$set: {"totalPoints": remainingPoints}}, function(err,doc) {
                if (err) { throw err; }
                else { console.log("Document Updated"); }
            });
        }
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
