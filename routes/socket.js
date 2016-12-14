var express = require('express');

var router = express.Router();

var server = require('http').createServer(router),
		io = require('socket.io').listen(server),
		fs = require('fs');

var site = require('../models/site');

module.exports = function(passport){

	io.sockets.on('connection', function (socket) {

    socket.on('favoris', function(id) {
      //ajouter en favoris
      socket.emit('rm');
    });

	});
	server.listen(3001);
  return router;
}
