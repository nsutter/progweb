var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var admin = require('./routes/admin');
var index = require('./routes/index');

var app = express();

var passport = require('passport');
require('./config/passport')(passport); // on récupère la configuration de Passport

// configuration du gestionnaire de vue, "pug")
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// les middleswares qui s'enchaînent
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: '27 j\'ai la recette',
	resave: true,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// vers les contrôleurs admin
app.use('/administration', admin);
// vers les contrôleurs classiques
app.use('/', index);

var socket = require('./routes/socket')(passport);
app.use('/', socket);

// gestion de la 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// gestion d'erreur
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // rendu de la page d'erreur
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
