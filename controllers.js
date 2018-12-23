require('dotenv').load();
const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);

const Donor = require('./models/donor');
const Donation = require('./models/donation');
const Email = require("./models/email");

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);

exports.chargeAndSaveDonorInfo = (req, res, next) => {
  // create a Stripe charge
  stripe.charges.create({
    amount        : req.body.donationAmount, // convert toInt, * 100
    currency      : "usd",
    source        : req.body.resultToken.id,
    receipt_email : req.body.emailAddress,
    description   : "test charge " + new Date(),
    metadata      : {emailAddress : req.body.emailAddress},
  }, (error, charge) => {
    if (error) {
      console.log('error', error);
      return error.message || new Error('Express, controllers.js:22')
    } else { // charge or falsey value
      console.log('charge', charge);
      
      // create a new document for the donor, donation, email
      const new_donor = new Donor({
        first_name : req.body.firstName,
        last_name  : req.body.lastName,
        email      : req.body.emailAddress,
        // statement_descriptor : 'CharityCo Donation'
      });
      
      new_donor.save((error, donorDocument) => {
        if (error) {
          console.log(error);
          return error.message || new Error('controllers.js:38')
        } else {
          const new_donation = new Donation({
            donor_id        : donorDocument._id,
            donation_amount : req.body.donationAmount,
          });
          
          new_donation.save((error, donationDocument) => {
            if (error) {
              console.log(error);
              return error.message || new Error('Express, controllers.js:48')
            } else {
              console.log(donationDocument);
            }
          });
          
          const new_email = new Email({
            donorId    : donorDocument._id,
            isReferred : false,
            firstName  : req.body.firstName,
            email       : req.body.emailAddress,
          });
          new_email.save(error => {
            if (error) {
              console.log("error");
              return error.message || new Error('Express, controllers.js:63')
            }
          });
          
          // prime react for the next step
          res.json({
            checkoutStep : 'referrals',
            donorId : donorDocument._id
          })
        }
      })
    }
  });
};

exports.saveReferrals = (req, res, next) => {
  console.log("received a post request to referral step. req.body: ", req.body);
  
  // create an array with truthy email objects
  let rawNameAndEmailArray = [
    { firstName : req.body.referral1FirstName, email : req.body.referral1EmailAddress },
    { firstName : req.body.referral2FirstName, email : req.body.referral2EmailAddress },
  ];
  let truthyEmailFilteredArray = [];
  for (let i = 0; i < rawNameAndEmailArray.length; i ++) {
    if (!!rawNameAndEmailArray[i].email) {
      truthyEmailFilteredArray.push(rawNameAndEmailArray[i])
    }
  } // only the pairs with an email are in the new array
  
  
  // new loop to create a model instance and push into the db
  for (let i = 0; i < truthyEmailFilteredArray.length; i ++) {
    
    // create an instance of the email model
    const referredContact = new Email({
      donorId : req.body.donorId,
      isReferred : true,
      firstName : truthyEmailFilteredArray[i].firstName,
      email : truthyEmailFilteredArray[i].email
    });
    referredContact.save((error, emailDocument) => {
      if (error) {
        console.log('error', error);
        return error.message || new Error('Express, controllers.js:107')
      } else {
        console.log(`document for index ${i}`, emailDocument);
      }
    })
  }
  
  res.json({
    checkoutStep : 'articlesList'
  })
};