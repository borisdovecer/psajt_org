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
    var sql = "SELECT * from slike";
    connection.query(sql, function(err, rows) {
        if (!err) {
            res.render('backend/create', { title: 'View', data: rows, user: req.user });
        }
        else {
            console.log('Error while performing Query.');
        }

    });
});

router.get('/iskustva', loggedin, function (req, res, next) {
    res.render('backend/createiskustva', {
        user: req.user
    })
});

/* POST submit */
router.post('/submit', function (req, res, next) {
    var today = new Date().toISOString().slice(0,-14);
    var sql = "INSERT INTO `novosti` SET ?";
    var post  = {title: req.body.title, description: req.body.description, img: req.body.img, category:req.body.category,author:req.body.author ,created_on:today };
    connection.query(sql,post, function (err, result) {
        if (!err) {
            res.redirect('/admin');
        }
        else {
            console.log(err);
        }
    });

});
router.post('/submiti', function (req, res, next) {

    var sql = "INSERT INTO `iskustva` SET ?";
    var post  = {title: req.body.title, description: req.body.description, author: req.body.author, location: req.body.location, substance: req.body.substance };
    connection.query(sql,post, function (err, result) {
        if (!err) {
            res.redirect('/admin');
        }
        else {
            console.log(err);
        }
    });

});




module.exports = router;