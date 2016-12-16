var express = require('express');
var passport = require('passport');
var router = express.Router();
var video = require('../models/video');
var administration = require('../models/administration');
var utilisateur = require('../models/utilisateur');

// middleware de vérification de l'authentification et de l'administration
function isLoggedInAndAdmin(req, res, next) {
  // l'utilisateur est connecté et administrateur, on continue

	if(req.isAuthenticated() && req.user.Admin == 'T')
		return next();

	// sinon on redirige vers l'accueil
	res.redirect('/');
}

router.get('/', isLoggedInAndAdmin, function(req, res, next) {
	function aff(err, utilisateurs, videos, favoris) {
		if(err)
			res.redirect('/');

		console.log(utilisateurs, videos, favoris);

		res.render('administration/administration', {title : 'Interface d\'administration', videos : videos, utilisateurs : utilisateurs, favoris : favoris, user : req.user});
	}

	administration.getAll(aff);
});

/* GET page d'affichage d'une vidéo */
router.get('/:idVideo', function(req, res, next) {
	function aff(err, result) {
		res.render('video', {title : 'Modification de ' + result[0].NomEmission,  video : result, user : req.user});
	}

	video.getOneById_notco(aff, req.params.idVideo);
});

module.exports = router;
