var express = require('express');
var router = express.Router();
var sessionId = null;

/* GET home page. */
router.get('/', function (req, res, next) {
  sessionId = req.query.id;
  req.app.set('sessionId', sessionId);
  res.render('index', { title: 'Express' });
});

module.exports = router;