var mysql = require('mysql');
var db = require('../config/database');

var connection = mysql.createConnection(db.connection);

module.exports =
{
  // récupération d'un utilisateur en fonction de son Login
  getOneById(callback, Login)
  {
    connection.query("SELECT * FROM UTILISATEUR WHERE Login = ?", [Login], function(err, rows){
      callback(err, rows);
    });
  },

  // modification d'un utilisateur en fonction de son Login
  update(arg, id)
  {
    if(arg.Newsletter)
    {
      var newsletter = 'T';
    }
    else
    {
      var newsletter = 'F';
    }


    if(arg.Admin)
    {
      var admin = 'T';
    }
    else
    {
      var admin = 'F';
    }

    connection.query("UPDATE UTILISATEUR SET Nom = ?, Prenom = ?, DateNaissance = ?, Email = ?, Newsletter = ?, Admin = ?, Nationnalite = ? WHERE Login = ?", [arg.Nom, arg.Prenom, arg.DateNaissance, arg.Email, newsletter, admin, arg.Nationnalite, id], function(err){
    });
  },

  // supprime un utilisateur en fonction de son Login
  deleteOneById(Login)
  {
    connection.query("DELETE FROM UTILISATEUR WHERE Login = ?", [Login], function(err, rows){});
  }
}
