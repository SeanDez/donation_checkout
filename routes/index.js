require("dotenv").load();
var express = require('express');
var router = express.Router();
let cors = require("cors");
const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);

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
    let parsed_amount = 0; // amount of the charge

  if (req.body.step === '1') {
      console.log("step 1 end");
      // steps
      // res.cookie('amount', req.body.donation_amount, {
      //   // maxAge : 3600000,
      //   httpOnly : true
      // });

      for (i = 0; i < req.body.donation_amount.length; i ++) {
          console.log(i, parseInt(req.body.donation_amount[i]));
          parsed_amount = parsed_amount + (parseInt(req.body.donation_amount[i]) || 0); // OR returns 1st if true, otherwise 2nd
      }
      console.log("end of loop", parsed_amount);

      res.render('donate2', { amount : parsed_amount });

  } else if (req.body.step === '2' || req.body.checkoutStep === 'paymentDetails') {
      // grab all the data
    console.log('backend req.body', req.body);
    console.log('req.body.resultToken', req.body.resultToken);
    console.log('backend req.body.donationAmount', req.body.donationAmount);

      // create a Stripe charge
    stripe.charges.create({
      amount        : req.body.donationAmount,
      currency      : "usd",
      source        : req.body.resultToken.id,
      receipt_email : req.body.emailAddress,
      description   : "test charge " + new Date(),
      metadata      : {emailAddress : req.body.emailAddress},
    })
          // .then((charge) => {
          //   console.log("charge: ", charge);
          // });
      //
      //     // create a new document for the donor, donation, email
      //     const new_donor = new Donor({
      //       first_name : req.body.firstName,
      //       last_name  : req.body.lastName,
      //       email      : req.body.emailAddress,
      //       // statement_descriptor : 'CharityCo Donation'
      //
      //     });
      //     new_donor.save((error, document) => {
      //       if (error) {
      //         console.log(error);
      //       } else {
      //         const new_donation = new Donation({
      //           donor_id        : document._id,
      //           donation_amount : parsed_amount,
      //         });
      //
      //         new_donation.save((error, document) => {
      //           if (error) {
      //             console.log(error);
      //           }
      //         });
      //
      //         const new_email = new Email({
      //           donor_id    : document._id,
      //           is_referred : false,
      //           first_name  : req.body.firstName,
      //           email       : req.body.emailAddress,
      //         });
      //         new_email.save(error => {
      //           if (error) {
      //             console.log("error");
      //           }
      //         });
      //       }
      //     });
      //
      //   },
      // )
      //       .catch(e => console.log(e));
  
  
  
      // res.render('donate3');
    }  else if (req.body.step === '3' || req.body.step === 'referrals') {
      console.log("received a post request to step 3. req.body: ", req.body);
      // create an instance of the email model
      // load it with

      // res.clearCookie();
      // res.json({ message : "here's a response back"});
  }
});


module.exports = router;
