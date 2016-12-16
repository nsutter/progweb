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

  addHistorique: function(id, login)
  {
    connection.query("INSERT INTO HISTORIQUE (IdVideo, DateVisionnage, Login) VALUES (?, CURDATE(), ?)", [id, login], function(err, rows){})
  },

  // récupère la vidéo d'identifiant id
  getOneById(callback, usr, id)
  {
    connection.query("SELECT * FROM VIDEO WHERE idVideo = ?", [id], function(err, rows){
      var video= rows;
      connection.query("SELECT * FROM FAVORIS WHERE IdVideo = ? AND Login = ?", [id, usr], function(err, rows, videos){
        var favori= rows;
        connection.query("SELECT * FROM VIDEO v, ABONEMENT f WHERE v.NomEmission = f.NomEmission AND f.Login = ? AND v.IdVideo = ?", [usr, id], function(err, rows){
          callback(err, video, favori, rows); // vidéo résultat, favori, abonnement
        })
      });
    });
  },

  getOneById_notco(callback, id)
  {
    connection.query("SELECT * FROM VIDEO WHERE IdVideo = ?", [id], function(err, rows){
      callback(err, rows); // vidéo résultat, favori, abonnement
    });
  },

  // supprime une vidéo en fonction d'IdVideo
  deleteOneById(id)
  {
    connection.query("DELETE FROM VIDEO WHERE IdVideo = ?", [id], function(err, rows){});
  },

  add(arg)
  {
    if(arg.Multilangue)
    {
      var multilangue = 'T';
    }
    else
    {
      var multilangue = 'F';
    }
    connection.query("INSERT INTO VIDEO VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [arg.IdVideo, arg.NomEmission, arg.NumEpisode, arg.Description, arg.Categorie, multilangue, arg.FormatImage, arg.Duree, "",arg.DateFinDroit, arg.DateFinDiff, arg.Pays], function(err){
      console.log(err);
    });
  },

  update(arg, id)
  {
    if(arg.Multilangue)
    {
      var multilangue = 'T';
    }
    else
    {
      var multilangue = 'F';
    }
    connection.query("UPDATE VIDEO SET NomEmission = ?, NumEpisode = ?, Description = ?, Categorie = ?, MultiLangue = ?, FormatImage = ?, Duree = ?, DateFinDroit = ?, DateFinDiff = ?, Pays = ? WHERE IdVideo = ?", [arg.NomEmission, arg.NumEpisode, arg.Description, arg.Categorie, multilangue, arg.FormatImage, arg.Duree, arg.DateFinDroit, arg.DateFinDiff, arg.Pays, id], function(err){
      console.log(err);
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

  // récupère les vidéos recommandées de l'utilisateur login
   getPopulars: function(callback, login)
   {
     console.log(login);

     connection.query("SELECT *, COUNT(*) FROM VIDEO v, CATEGORIEU c, HISTORIQUE h WHERE c.Login = ? AND c.categorie = v.categorie AND v.IdVideo = h.IdVideo GROUP BY v.IdVideo ORDER BY COUNT(*) DESC", [login], function(err, rows)
     {
       console.log(rows);
       callback(err, rows);
     })
 },

  // INSERTION

  // insère un favori pour l'utilisateur Login
  setFavori: function(Login, Mdp, IdVideo)
  {
    connection.query("SELECT * FROM UTILISATEUR WHERE Login = ? AND Mdp = ?", [Login, Mdp], function(err, rows){
      if(rows.length == 1)
      {
        connection.query("INSERT INTO FAVORIS VALUES (?,?)", [Login, IdVideo], function(err, rows){})
      }
    });
  },

  // supprime un favori en fonction du Login et d'IdVideo
  deleteFavori: function(Login, IdVideo)
  {
    connection.query("DELETE FROM FAVORIS WHERE Login = ? AND IdVideo = ?", [Login, IdVideo], function(err, rows){});
  },

  delFav: function(Login, IdVideo, Mdp)
  {
    connection.query("DELETE FROM FAVORIS WHERE IdVideo = ? AND Login= (SELECT Login FROM UTILISATEUR WHERE Login= ? AND Mdp= ?)", [IdVideo, Login, Mdp], function(err, rows){});
  },

  delAbonement: function(Login, NomEmission, Mdp)
  {
    connection.query("DELETE FROM ABONEMENT WHERE NomEmission = ? AND Login= (SELECT Login FROM UTILISATEUR WHERE Login= ? AND Mdp= ?)", [NomEmission, Login, Mdp], function(err, rows){});
  },

  search: function(callback, txt)
  {
    var tmp= "%"+txt+"%";
    connection.query("SELECT * FROM VIDEO WHERE NomEmission LIKE ? OR Description LIKE ?",[tmp, tmp], function(err, rows){
      console.log(txt);
      callback(err, rows);
    });
  },

  // insère un abonnement pour l'utilisateur Login
  setAbonnement: function(Login, Mdp, NomEmission)
  {
    connection.query("SELECT * FROM UTILISATEUR WHERE Login = ? AND Mdp = ?", [Login, Mdp], function(err, rows){
      if(rows.length == 1)
      {
        connection.query("INSERT INTO ABONEMENT VALUES (?,?)", [Login, NomEmission], function(err, rows){})
      }
    });
  },
}
