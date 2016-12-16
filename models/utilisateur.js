var mysql = require('mysql');
var db = require('../config/database');
var bcrypt = require('bcrypt-nodejs');


var connection = mysql.createConnection(db.connection);

// MODELE UTILISATEUR
module.exports =
{
  // récupération d'un utilisateur en fonction de son Login
  getOneById(callback, Login)
  {
    connection.query("SELECT * FROM UTILISATEUR WHERE Login = ?", [Login], function(err, rows){
      callback(err, rows);
    });
  },

  changepass(login, Mdp)
  {
    var hash= bcrypt.hashSync(Mdp, null, null);
    connection.query("UPDATE UTILISATEUR SET Mdp= ? WHERE Login= ?", [hash, login], function(err, rows){});
  },

  // modification d'un utilisateur en fonction de son Login
  update(arg, id)
  {
    if(arg.Newsletter) // on formate correctement la newsletter et l'admin
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

  // modification de soi même
  update_noadmin(arg, id)
  {
    if(arg.Newsletter) // on formate correctement la newsletter et l'admin
    {
      var newsletter = 'T';
    }
    else
    {
      var newsletter = 'F';
    }

    connection.query("UPDATE UTILISATEUR SET Nom = ?, Prenom = ?, DateNaissance = ?, Email = ?, Newsletter = ?, Nationnalite = ? WHERE Login = ?", [arg.Nom, arg.Prenom, arg.DateNaissance, arg.Email, newsletter, arg.Nationnalite, id], function(err){
    });
  },

  // supprime un utilisateur en fonction de son Login
  deleteOneById(Login)
  {
    connection.query("DELETE FROM UTILISATEUR WHERE Login = ?", [Login], function(err, rows){});
  }
}
