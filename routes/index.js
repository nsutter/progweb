var express = require('express');
var passport = require('passport');
var router = express.Router();

// middleware
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

/* GET page d'accueil */
router.get('/', function(req, res, next) {
  // si on est connecté, on peut afficher l'utilisateur courant avec req.user
  res.render('index', {title: 'Accueil', user : req.user});
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

/* GET page d'affichage du profil d'un utilisateur */
router.get('/profil', function(req, res, next) {
  res.render('profil', {title: 'Profil de ' + req.user.Prenom + ' ' + req.user.Nom, user : req.user});
});

module.exports = router;
