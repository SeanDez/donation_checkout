require("dotenv").load();
var express = require('express');
var router = express.Router();
let cors = require("cors");
const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);

const controllers = require('../controllers');

const Donor = require('../models/donor');
const Donation = require('../models/donation');
const Email = require("../models/email");

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/donate1', (req, res, next) => {
  res.render('donate1');
});

router.post('/test', (req, res, next) => {
  
  res.json({req : req.body})
  // res.send("Hello res.send on /test")
});

// const corsOptions = {origin : true, optionsSuccessStatus : 200 }; // CORS policy set broadly in app.js

router.post('/api/donate', (req, res, next) => {
  // step 1: wake up the cold-start server
  // step 2: create a stripe charge. save donor and email objects
  // step 3: save referees as email documents
  
  if (req.body.coldStart) {
    null
  } else if (req.body.checkoutStep === 'paymentDetails') {
      controllers.chargeAndSaveDonorInfo(req, res, null);
  } else if (req.body.checkoutStep === 'referrals') {
      controllers.saveReferrals(req, res, null);
  }
  
  
  // if (req.body.step === '1') {
  //
  //
  // } else if (req.body.step === '2' || req.body.checkoutStep === 'paymentDetails') {
  //
  //
  //
  //
  // } else if (req.body.step === '3' || req.body.checkoutStep === 'referrals') {
  //     console.log("received a post request to referral step. req.body: ", req.body);
  //
  //     // create an array with truthy email objects
  //     let rawNameAndEmailArray = [
  //       { firstName : req.body.referral1FirstName, email : req.body.referral1EmailAddress },
  //       { firstName : req.body.referral2FirstName, email : req.body.referral2EmailAddress },
  //     ];
  //     let truthyEmailFilteredArray = [];
  //     for (let i = 0; i < rawNameAndEmailArray.length; i ++) {
  //       if (!!rawNameAndEmailArray[i].email) {
  //         truthyEmailFilteredArray.push(rawNameAndEmailArray[i])
  //       }
  //     } // now only the pairs with an email are in the new array
  //
  //
  //     // new loop to create a model instance and push into the db
  //     for (let i = 0; i < truthyEmailFilteredArray.length; i ++) {
  //
  //       // create an instance of the email model
  //       const referredContact = new Email({
  //         donorId : req.body.donorId,
  //         isReferred : true,
  //         firstName : truthyEmailFilteredArray[i].firstName,
  //         email : truthyEmailFilteredArray[i].email
  //       });
  //       referredContact.save((error, emailDocument) => {
  //         if (error) {
  //           console.log('error', error);
  //           return error.message || new Error('Express, index.js:146')
  //         } else {
  //           console.log(`document for index ${i}`, emailDocument);
  //         }
  //       })
  //     }
  //
  //     res.json({
  //       checkoutStep : 'articlesList'
  //     })
  // }
});


module.exports = router;
