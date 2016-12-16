var express = require('express');
var passport = require('passport');
var router = express.Router();
var video = require('../models/video');
var administration = require('../models/administration');
var utilisateur = require('../models/utilisateur');

// middleware de vérification de l'authentification
function isLoggedIn(req, res, next) {
  // l'utilisateur est connecté, on continue
	if(req.isAuthenticated())
		return next();

	// sinon on redirige vers l'accueil
	res.redirect('/');
}

/* GET page d'accueil */
router.get('/', function(req, res, next) {
  function aff(err, result, categories) {
    if(err)
      res.redirect('/404');

    res.render('index', {title : 'Accueil', video : result, user : req.user, categories : categories});
  }

  video.getAllVideos(aff); // on récupère les vidéos - partie "modèle"
});

/* GET page d'inscription */
router.get('/inscription', function(req, res) {
    res.render('inscription');
});

router.post('/search', function(req, res) {
	function aff(err, result){
		console.log(result);
		res.render('search', {res: result, user: req.user, research: req.body.research});
	}
	video.search(aff, req.body.research);
});

/* POST formulaire d'inscription - appel de la stratégie 'local-signup' pour l'inscription
  se trouvant dans /config/passport.js
*/
router.post('/inscription', passport.authenticate('local-signup', {
		successRedirect : '/', // page d'accueil en cas de succès
		failureRedirect : '/inscription', // page d'inscription en cas d'échec
}));

/* GET page de connexion */
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
router.get('/deconnexion', isLoggedIn, function(req, res) {
    req.logout();
    res.redirect('/');
});

/* GET page d'affichage du profil d'un utilisateur */
router.get('/profil', isLoggedIn, function(req, res, next) {
  res.render('profil', {title : 'Profil de ' + req.user.Prenom + ' ' + req.user.Nom, user : req.user});
});

/* POST modification de son profil */
router.post('/profil', isLoggedIn, function(req, res, next) {
	utilisateur.update_noadmin(req.body, req.user.Login);
	res.redirect('/profil');
});

/* GET page d'affichage d'une vidéo */
router.get('/video/:idVideo', function(req, res, next) {
	if(req.user) // si on est connecté
	{
		function aff(err, result, estFavori, estAbonne) {
			res.render('video', {title : 'Vidéo : ' + result[0].NomEmission,  video : result, user : req.user, estFavori : estFavori, estAbonne : estAbonne});
		}
		video.addHistorique(req.params.idVideo, req.user.Login);
		video.getOneById(aff, req.user.Login, req.params.idVideo);
	}
	else{
		function aff(err, result) {
			res.render('video', {title : 'Vidéo : ' + result[0].NomEmission,  video : result, user : req.user, estFavori : 0, estAbonne : 0});
		}
		video.getOneById_notco(aff, req.params.idVideo);
	}
});

/* GET page d'affichage des vidéos d'une catégorie */
router.get('/categorie/:idCategorie', function(req, res, next) {
  function aff(err, result) {
    if(err)
      res.redirect('/');

    res.render('categorie', {title : 'Toutes les vidéos de la catégorie : ' + req.params.idCategorie,  video : result, user : req.user});
  }

  video.getAllVideosByCategory(aff, req.params.idCategorie); // on récupère les vidéos - partie "modèle"
});

/* GET page d'affichage des nouveautés personnalisés */
router.get('/nouveaute', isLoggedIn, function(req, res, next) {
	function aff(err, result) {
		if(err)
			res.redirect('/');

		res.render('nouveaute', {title : 'Toutes les dernières vidéos des émissions que vous suivez',  video : result, user : req.user});
	}

	video.getNouveautes(aff, req.user.Login); // on récupère les vidéos - partie "modèle"
});

/* GET page d'affichage des vidéos favorites */
router.get('/favori', isLoggedIn, function(req, res, next) {
	function aff(err, result) {
		if(err)
			res.redirect('/');

		res.render('favori', {title : 'Toutes vos vidéos favorites',  video : result, user : req.user});
	}

	video.getFavoris(aff, req.user.Login); // on récupère les vidéos - partie "modèle"
});

/* GET page d'affichage des vidéos recommandés */
router.get('/recommandation', isLoggedIn, function(req, res, next) {
	function aff(err, result) {
		if(err)
			res.redirect('/');

		res.render('recommandation', {title : 'Toutes vos recommandations',  video : result, user : req.user});
	}

	video.getPopulars(aff, req.user.Login); // on récupère les vidéos - partie "modèle"
});

module.exports = router;
