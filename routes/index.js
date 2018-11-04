var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/donate1', (req, res, next) => {
  res.render('donate1');
});

router.post('/api/donate', (req, res, next) => {
  if (req.body.step === '1') {
      // steps
      res.render('donate2', {donation_amount : req.body.amount});
  } else if (req.body.step === '2') {
        // steps
        res.render('donate3');
  }  else if (req.body.step === '3') {
      // steps
      res.render('donate4');
  }
});


module.exports = router;
