require("dotenv").load();
var express = require('express');
var router = express.Router();

const Donor = require('../models/donor');
const Donation = require('../models/donation');
const Email = require("../models/email");

const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/donate1', (req, res, next) => {
  res.render('donate1');
});

router.post('/api/donate', (req, res, next) => {
    let parsed_amount = 0; // amount of the charge

  if (req.body.step === '1') {
      console.log("step 1 end");
      // steps
      res.cookie('amount', req.body.donation_amount, {
        // maxAge : 3600000,
        httpOnly : true
      });

      for (i = 0; i < req.body.donation_amount.length; i ++) {
          console.log(i, parseInt(req.body.donation_amount[i]));
          parsed_amount = parsed_amount + (parseInt(req.body.donation_amount[i]) || 0); // OR returns 1st if true, otherwise 2nd
      }
      console.log("end of loop", parsed_amount);

      res.render('donate2', { amount : parsed_amount });

  } else if (req.body.step === '2') {
      console.log("step 2 end");
      // grab all the data
      // ship it to Stripe

      const stripe_charge = stripe.charges.create({
          amount        : parsed_amount,
          currency      : "usd",
          source        : "tok_visa",
          receipt_email : req.body.email,
      }).then((charge) => console.log(charge))
        .catch(e => console.log(e));


      // upon hearing a response, save everything to the 3 collections via the models




        res.render('donate3');
  }  else if (req.body.step === '3') {
      // steps

      res.clearCookie();
      res.render('donate4');
  }
});


module.exports = router;
