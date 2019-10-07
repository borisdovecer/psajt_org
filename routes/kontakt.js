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

/* GET onama page. */
router.get('/', function (req, res, next) {
    res.render('kontakt', {
        title: 'Psajt'
    });
});

/* POST submit poruke */
router.post('/submit', function (req, res, next) {
    var today = new Date().toISOString().slice(0,-14);
    let sql = "INSERT INTO `poruke` SET ?";
    let post  = {name: req.body.name, message: req.body.message, email: req.body.email, created_on:today };
    connection.query(sql,post, function (err, result) {
        if (!err) {
            res.redirect('/kontakt');
        }
        else {
            console.log(err);
        }
    });

});

module.exports = router;
