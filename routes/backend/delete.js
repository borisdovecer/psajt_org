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

/* delete novosti */
router.get('/:id',loggedin, function(req, res, next) {
    var sql = "DELETE FROM `novosti` WHERE novosti_id = ?";
    var id = req.param("id");
    connection.query(sql ,id , function(err, rows) {
        if (!err) {
            res.redirect('/update');
        }
        else {
            console.log('Error while performing Query.');
        }

    });
});

/* delete iskustva */
router.get('/iskustva/:id',loggedin, function(req, res, next) {
    var sql = "DELETE FROM `iskustva` WHERE iskustvo_id = ?";
    var id = req.param("id");
    connection.query(sql ,id , function(err, rows) {
        if (!err) {
            res.redirect('/update/iskustva');
        }
        else {
            console.log('Error while performing Query.');
        }

    });
});

/* delete psihodelici */
router.get('/psihodelici/:id',loggedin, function(req, res, next) {
    var sql = "DELETE FROM `psihodelici` WHERE psy_id = ?";
    var id = req.param("id");
    connection.query(sql ,id , function(err, rows) {
        if (!err) {
            res.redirect('/update/psihodelici');
        }
        else {
            console.log('Error while performing Query.');
        }

    });
});


module.exports = router;
