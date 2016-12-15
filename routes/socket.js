var express = require('express');
var video = require('../models/video');

var router = express.Router();

var server = require('http').createServer(router),
		io = require('socket.io').listen(server),
		fs = require('fs');

module.exports = function(passport){

	io.sockets.on('connection', function (socket) {

    socket.on('favoris', function(vid, Mdp, log) {
			video.setFavori(log, Mdp, vid);
      socket.emit('rm-fav');
    });
		socket.on('abonnee', function(vid, Mdp, log) {
			video.setAbonnement(log, Mdp, vid);
      socket.emit('rm-abo');
    });

	});
	server.listen(3001);
  return router;
}
