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

var loggedin = function (req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/login')
    }
}

router.get('/', loggedin, function (req, res, next) {
    var sql = "SELECT * from komentari ORDER BY kom_id DESC";
    connection.query(sql, function(err, rows) {
        if (!err) {
            res.render('backend/komentari', { title: 'View', data: rows, user: req.user });
        }
        else {
            console.log('Error while performing Query.');
        }

    });
});

router.get('/poruke', loggedin, function (req, res, next) {
    var sql = "SELECT * from poruke ORDER BY poruka_id DESC";
    connection.query(sql, function(err, rows) {
        if (!err) {
            res.render('backend/poruke', { title: 'View', data: rows});
        }
        else {
            console.log('Error while performing Query.');
        }

    });
});



module.exports = router;