var express = require('express');
var router = express.Router();


/* konekcija na bazu */
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'psajt'
});

connection.connect();

/* GET vesti page. */
connection.query('SELECT * from psihodelici', function(err, rows) {
    if (!err){
        router.get('/', function(req, res, next) {
            res.render('psihodelicilist', { title: 'Psajt', data: rows });
        });
    }
    else{
        console.log('Error while performing Query.');
    }
});
/* GET vest page. */
router.get('/:name', function(req, res, next) {
    var sql = "SELECT * from psihodelici WHERE name = ?";
    var name = req.param("name");
    console.log(name);
    connection.query(sql ,name , function(err, rows) {
        if (!err) {
            res.render('psihodelici', {title: 'Psajt', name: name, data: rows});
        }
        else {
            console.log('Error while performing Query.');
        }
    });
});

module.exports = router;
