var express = require('express');

var router = express.Router();

var server = require('http').createServer(router),
		io = require('socket.io').listen(server),
		fs = require('fs');

module.exports = function(passport){

	io.sockets.on('connection', function (socket) {

    socket.on('favoris', function(id) {
      //ajouter en favoris
			// var userId = socket.request.session.passport.user;
      socket.emit('rm');
    });

	});
	server.listen(3001);
  return router;
}
