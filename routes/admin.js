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

/* GET page d'accueil de l'administration */
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
		res.render('administration/utilisateur', {title : 'Modification de l\'utilisateur ' + result[0].Prenom + " " + result[0].Nom,  utilisateur : result, user : req.user});
	}

	utilisateur.getOneById(aff, req.params.idUtilisateur);
});

/* GET page d'affichage de la modification d'une utilisateur */
router.get('/utilisateur/:idUtilisateur', isLoggedInAndAdmin, function(req, res, next) {
	function aff(err, result) {
		res.render('administration/utilisateur', {title : 'Modification de l\'utilisateur ' + result[0].Login,  utilisateur : result, user : req.user});
	}

	utilisateur.getOneById(aff, req.params.idUtilisateur);
});

// MISE A JOUR

// mise à jour d'un utilisateur
router.post('/utilisateur/:idUtilisateur', isLoggedInAndAdmin, function(req, res, next){
	utilisateur.update(req.body, req.params.idUtilisateur);
	res.redirect('/administration');
})

// mise à jour d'une vidéo
router.post('/video/:IdVideo', isLoggedInAndAdmin, function(req, res, next){
	video.update(req.body, req.params.IdVideo);
	res.redirect('/administration');
})

// SUPPRESSION

// route de suppression d'une vidéo
router.post('/deleteVideo/:idVideo', isLoggedInAndAdmin, function(req, res, next){
	video.deleteOneById(req.params.idVideo);
	res.redirect('/administration');
})

// route de suppression d'un favori
router.post('/deleteFavori/:Login/:IdVideo', isLoggedInAndAdmin, function(req, res, next) {
	video.deleteFavori(req.params.Login, req.params.IdVideo);
	res.redirect('/administration');
});

// route de suppresion d'un utilisateur
router.post('/deleteUtilisateur/:Login', isLoggedInAndAdmin, function(req, res, next) {
	utilisateur.deleteOneById(req.params.Login);
	res.redirect('/administration');
});

// AJOUT D'UNE VIDÉO

router.get('/nouvelleVideo', isLoggedInAndAdmin, function(req, res, next) {
	res.render('administration/nouvelleVideo', {title : 'Ajout d\'une vidéo'});
});

router.post('/nouvelleVideo', isLoggedInAndAdmin, function(req, res, next) {
	video.add(req.body);
	res.redirect('/administration');
});

module.exports = router;
