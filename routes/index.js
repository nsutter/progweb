var express = require('express');
var passport = require('passport');
var router = express.Router();

var video = require('../models/video');

/* GET page d'accueil */
router.get('/', function(req, res, next) {
  function aff(err, result) {
    res.render('index', { title: 'Accueil', video : result, user : req.user});
  }

  video.getAll(aff);
});

/* GET page d'inscription */
router.get('/inscription', function(req, res) {
    res.render('inscription');
});

/* POST formulaire d'inscription - appel de la stratégie 'local-signup' pour l'inscription
  se trouvant dans /config/passport.js
*/
router.post('/inscription', passport.authenticate('local-signup', {
		successRedirect : '/', // page d'accueil en cas de succès
		failureRedirect : '/inscription', // page d'inscription en cas d'échec
}));

router.get('/connexion', function(req, res) {
    res.render('connexion', {user : req.user});
});

/* POST formulaire de connexion - appel de la stratégie 'local-login' pour l'inscription
  se trouvant dans /config/passport.js
 */
router.post('/connexion', passport.authenticate('local-login'), function(req, res) {
    res.redirect('/');
});

/* GET déconnexion */
router.get('/deconnexion', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
