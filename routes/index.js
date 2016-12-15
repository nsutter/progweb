var express = require('express');
var passport = require('passport');
var router = express.Router();
var video = require('../models/video');

// middleware de vérification de l'authentification
function isLoggedIn(req, res, next) {
  // l'utilisateur est connecté, on continue
	if(req.isAuthenticated())
		return next();

	// sinon on redirige vers l'accueil
	res.redirect('/');
}

// middleware de vérification de l'authentification et de l'administration
function isLoggedInAndAdmin(req, res, next) {
  // l'utilisateur est connecté et administrateur, on continue
	if(req.isAuthenticated() && req.user.admin == 'T')
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
router.get('/deconnexion', isLoggedIn, function(req, res) {
    req.logout();
    res.redirect('/');
});

/* GET page d'affichage du profil d'un utilisateur */
router.get('/profil', isLoggedIn, function(req, res, next) {
  res.render('profil', {title : 'Profil de ' + req.user.Prenom + ' ' + req.user.Nom, user : req.user});
});

/* GET page d'affichage d'une vidéo */
router.get('/video/:idVideo', function(req, res, next) {
	if(req.user)
	{
		function aff(err, result, estFavori, estAbonne) {
			res.render('video', {title : 'Vidéo : ' + result[0].NomEmission,  video : result, user : req.user, estFavori : estFavori, estAbonne : estAbonne});
		}
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

router.get('/nouveaute', function(req, res, next) {
	function aff(err, result) {
		if(err)
			res.redirect('/');

		res.render('nouveaute', {title : 'Toutes les dernières vidéos des émissions que vous suivez',  video : result, user : req.user});
	}

	video.getNouveautes(aff, req.user.Login); // on récupère les vidéos - partie "modèle"
});

router.get('/favori', function(req, res, next) {
	function aff(err, result) {
		if(err)
			res.redirect('/');

		res.render('favori', {title : 'Toutes vos vidéos favorites',  video : result, user : req.user});
	}

	video.getFavoris(aff, req.user.Login); // on récupère les vidéos - partie "modèle"
});

router.get('/administration', isLoggedInAndAdmin, function(req, res, next) {
	function aff(err, videos, utilisateurs, favoris) {
		if(err)
			res.redirect('/');

		res.render('administration/administration', {title : 'Interface d\'administration', videos : videos, utilisateurs : utilisateurs, favoris : favoris, user : req.user});
	}

	video.getAllForAdmin(aff);
})

module.exports = router;
