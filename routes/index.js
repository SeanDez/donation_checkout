var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/api/donate', (req, res, next) => {
  if (req.body.step === '1') {

  }
});


module.exports = router;
