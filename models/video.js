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
  getAll: function(callback)
  {
    connection.query("SELECT * FROM VIDEO", function(err, rows){
      callback(err, rows, extractionDesCategories(rows));
    });
  },

  getByCategory: function(callback, category)
  {
    connection.query("SELECT * FROM VIDEO WHERE Categorie = ?", [category], function(err, rows){
      callback(err, rows);
    });
  }
}
