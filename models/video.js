var mysql = require('mysql');
var db = require('../config/database');

var connection = mysql.createConnection(db.connection);

/*
  Récupère la liste des catégories depuis la liste des toutes les vidéos existantes
  (nécessaire car pas de table contenant la liste des catégories)
*/
function extractionDesCategories(rows)
{
  var res = []; // les différentes catégories de vidéos existantes

  for(var i = 0; i < rows.length; i++)
  {
    if(res.indexOf(rows[i].Categorie) == -1)
    {
      res.push(rows[i].Categorie);
    }
  }

  return res;
}

module.exports =
{
  // RECUPERATION

  // récupère toutes les vidéos
  getAllVideos: function(callback)
  {
    connection.query("SELECT * FROM VIDEO", function(err, rows){
      callback(err, rows, extractionDesCategories(rows));
    });
  },

  // récupère les vidéos de la catégorie category
  getAllVideosByCategory: function(callback, category)
  {
    connection.query("SELECT * FROM VIDEO WHERE Categorie = ?", [category], function(err, rows){
      callback(err, rows);
    });
  },

  // récupère la vidéo d'identifiant id
  getOneById(callback, usr, id)
  {
    connection.query("SELECT * FROM VIDEO WHERE idVideo = ?", [id], function(err, rows, id){
      var video= rows;
      connection.query("SELECT * FROM FAVORIS WHERE IdVideo = ? AND Login = ?", [id, usr], function(err, rows, videos, id, usr){
        var favori= rows;
        connection.query("SELECT * FROM VIDEO v, ABONEMENT f WHERE v.NomEmission = f.NomEmission AND f.Login = ? AND v.IdVideo = ?", [usr, id], function(err, rows, videos, favori, id, usr){
          callback(err, video, favori, rows); // vidéo résultat, favori, abonnement
        })
      });
    });
  },

  getOneById_notco(callback, id)
  {
    connection.query("SELECT * FROM VIDEO WHERE idVideo = ?", [id], function(err, rows){
      callback(err, rows); // vidéo résultat, favori, abonnement
    });
  },

  // récupère les vidéos diffusées il y a - de 2 semaines des émissions auxquelles l'utilisateur est abonné
  getNouveautes: function(callback, login)
  {
    connection.query("SELECT * FROM ABONEMENT a, VIDEO v WHERE a.Login = ? AND a.NomEmission = v.NomEmission AND CURDATE() < v.DateFinDiff", [login], function(err, rows){
      callback(err, rows);
    });
  },

  // récupère les vidéos favoris de l'utilisateur
  getFavoris: function(callback, login)
  {
    connection.query("SELECT * FROM FAVORIS f, VIDEO v WHERE f.Login = ? AND f.IdVideo = v.IdVideo", [login], function(err, rows){
      callback(err, rows);
    });
  },

  // INSERTION

  // insère un favori pour l'utilisateur Login
  setFavori: function(Login, Mdp, IdVideo)
  {
    connection.query("SELECT * FROM UTILISATEUR u WHERE Login = ? AND Mdp = ?", [Login, Mdp], function(err, rows, Login, IdVideo){
      if(rows.length == 1)
      {
        connection.query("INSERT INTO FAVORIS VALUES (?,?)", [Login, IdVideo], function(err, rows){})
      }
    });
  },

  // insère un abonnement pour l'utilisateur Login
  setAbonnement: function(Login, Mdp, NomEmission)
  {
    connection.query("SELECT * FROM UTILISATEUR u WHERE Login = ? AND Mdp = ?", [Login, Mdp], function(err, rows, Login, NomEmission){
      if(rows.length == 1)
      {
        connection.query("INSERT INTO ABONEMENT VALUES (?,?)", [Login, NomEmission], function(err, rows){})
      }
    });
  }
}
