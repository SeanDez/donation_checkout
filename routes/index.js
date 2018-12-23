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
  // step 1: wake up hibernating back-end on initial load of the client app
  // step 2: create a stripe charge. save donor and email objects
  // step 3: save referees as email documents
  
  if (req.body.coldStart) {
    console.log("cold start request received");
    res.json({ message : 'Server has been cold-started' })
  } else if (req.body.checkoutStep === 'paymentDetails') {
      controllers.chargeAndSaveDonorInfo(req, res, null);
  } else if (req.body.checkoutStep === 'referrals') {
      controllers.saveReferrals(req, res, null);
  }
});


module.exports = router;
