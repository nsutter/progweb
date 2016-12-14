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
  // récupère toutes les vidéos
  getAll: function(callback)
  {
    connection.query("SELECT * FROM VIDEO", function(err, rows){
      callback(err, rows, extractionDesCategories(rows));
    });
  },
  // récupère les vidéos de la catégorie category
  getByCategory: function(callback, category)
  {
    connection.query("SELECT * FROM VIDEO WHERE Categorie = ?", [category], function(err, rows){
      callback(err, rows);
    });
  },
  // récupère la vidéo d'identifiant id
  getOneById(callback, id)
  {
    connection.query("SELECT * FROM VIDEO WHERE idVideo = ?", [id], function(err, rows){
      callback(err, rows);
    });
  },
  // récupère les vidéos diffusées il y a - de 2 semaines des émissions auxquelles l'utilisateur est abonné
  getNouveautes: function(callback, login)
  {  // TO-DO : ajouté depuis - 2 semaines
    connection.query("SELECT * FROM ABONEMENT a, VIDEO v, DIFFUSION d WHERE a.Login = ? AND a.NomEmission = v.NomEmission AND v.IdVideo = d.IdVideo", [login], function(err, rows){
      callback(err, rows);
    });
  },
  // récupère les vidéos favoris de l'utilisateur
  getFavoris: function(callback, login)
  {
    connection.query("SELECT * FROM FAVORIS f, VIDEO v WHERE f.Login = ? AND f.IdVideo = v.IdVideo", [login], function(err, rows){
      callback(err, rows);
    });
  }
}
