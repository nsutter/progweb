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

		res.render('administration/administration', {title : 'Interface d\'administration', videos : videos, utilisateurs : utilisateurs, favoris : favoris, user : req.user});
	}

	administration.getAll(aff);
});

/* GET page d'affichage de la modification d'une vidéo */
router.get('/video/:idVideo', isLoggedInAndAdmin, function(req, res, next) {
	function aff(err, result) {
		res.render('administration/video', {title : 'Modification de la vidéo ' + result[0].NomEmission,  video : result, user : req.user});
	}

	video.getOneById_notco(aff, req.params.idVideo);
});

/* GET page d'affichage de la modification d'un utilisateur */
router.get('/utilisateur/:idUtilisateur', isLoggedInAndAdmin, function(req, res, next) {
	function aff(err, result) {
		res.render('administration/utilisateur', {title : 'Modification de l\'utilisateur' + result[0].Prenom + " " + result[0].Nom,  utilisateur : result, user : req.user});
	}

	utilisateur.getOneById(aff, req.params.idUtilisateur);
});

router.post('/video/:IdVideo', isLoggedInAndAdmin, function(req, res, next){
	video.update(req.body, req.params.IdVideo);
	res.redirect('/');
})

router.post('/deleteVideo/:idVideo', isLoggedInAndAdmin, function(req, res, next){
	video.deleteOneById(req.params.idVideo);
	res.redirect('/');
})

/* GET page d'affichage de la modification d'une utilisateur */
router.get('/utilisateur/:idUtilisateur', isLoggedInAndAdmin, function(req, res, next) {
	function aff(err, result) {
		res.render('administration/utilisateur', {title : 'Modification de l\'utilisateur ' + result[0].Login,  utilisateur : result, user : req.user});
	}

	utilisateur.getOneById(aff, req.params.idUtilisateur);
});

router.post('/deleteFavori/:Login/:IdVideo', function(req, res, next) {
	video.deleteFavori(req.params.Login, req.params.IdVideo);
	res.redirect('/');
});

module.exports = router;
