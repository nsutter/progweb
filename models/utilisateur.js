var mysql = require('mysql');
var db = require('../config/database');

var connection = mysql.createConnection(db.connection);

module.exports =
{
  // RECUPERATION

  // récupération d'un utilisateur
  getOneById(callback, Login)
  {
    connection.query("SELECT * FROM UTILISATEUR WHERE Login = ?", [Login], function(err, rows){
      callback(err, rows);
    });
  },
}
