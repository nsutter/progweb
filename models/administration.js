var mysql = require('mysql');
var db = require('../config/database');

var connection = mysql.createConnection(db.connection);

module.exports =
{
  // RECUPERATION

  getAll(callback, usr, id)
  {
    connection.query("SELECT * FROM UTILISATEUR WHERE admin = 'F'", function(err, rows){
      var utilisateur = rows;
      connection.query("SELECT * FROM VIDEO", function(err, rows){
        var video = rows;
        connection.query("SELECT * FROM FAVORIS", function(err, rows){
          callback(err, utilisateur, video, rows); // utilisateur, video, favori
        })
      });
    });
  }
}
