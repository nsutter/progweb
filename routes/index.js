var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("req.user : " + JSON.stringify(req.user));
  res.render('index', { title: 'Accueil' });
});

router.get('/inscription', function(req, res) {
    res.render('inscription');
});

router.post('/inscription', passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/inscription', // redirect back to the signup page if there is an error
}));

router.get('/connexion', function(req, res) {
    res.render('connexion');
});

router.post('/connexion', passport.authenticate('local-login'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


module.exports = router;
