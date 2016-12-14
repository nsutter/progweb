var mysql = require('mysql');
var db = require('../config/database');

var connection = mysql.createConnection(db.connection);


module.exports =
{
  getAll: function(callback)
  {
    connection.query("SELECT * FROM VIDEO", function(err, rows){
      callback(err, rows);
    });
  }
}
