var mysql = require('mysql');
var db = require('../config/database');

var connection = mysql.createConnection(db.connection);

// MODELE ADMINISTRATION
module.exports =
{
  // récupération des utilisateurs, des vidéos et des favoris
  getAll(callback, usr, id)
  {
    connection.query("SELECT * FROM UTILISATEUR WHERE admin = 'F'", function(err, rows){
      var utilisateurs = rows;
      connection.query("SELECT * FROM VIDEO", function(err, rows){
        var videos = rows;
        connection.query("SELECT * FROM FAVORIS", function(err, rows){
          callback(err, utilisateurs, videos, rows); // utilisateurs, videos, favoris
        })
      });
    });
  }
}
