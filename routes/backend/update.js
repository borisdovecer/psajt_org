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
    var sql = "SELECT * from novosti";
    connection.query(sql, function(err, rows) {
        if (!err) {
            res.render('backend/update', { title: 'View', data: rows, user: req.user });
        }
        else {
            console.log('Error while performing Query.');
        }

    });
});
router.get('/iskustva', loggedin, function (req, res, next) {
    var sql = "SELECT * from iskustva";
    connection.query(sql, function(err, rows) {
        if (!err) {
            res.render('backend/updateiskustvo', { title: 'View', data: rows, user: req.user });
        }
        else {
            console.log('Error while performing Query.');
        }

    });
});

router.get('/iskustva/:id',loggedin, function(req, res, next) {
    var sql = "SELECT * from iskustva WHERE iskustvo_id = ?";
    var id = req.param("id");
    connection.query(sql ,id , function(err, rows) {
        if (!err) {
            res.render('backend/editiskustvo', {title: 'Admin', id: id,user: req.user, data: rows});
        }
        else {
            console.log('Error while performing Query.');
        }
    });
});


router.get('/psihodelici', loggedin, function (req, res, next) {
    var sql = "SELECT * from psihodelici";
    connection.query(sql, function(err, rows) {
        if (!err) {
            res.render('backend/updatepsy', { title: 'View', data: rows, user: req.user });
        }
        else {
            console.log('Error while performing Query.');
        }

    });
});

router.get('/psihodelici/:id',loggedin, function(req, res, next) {
    var sql = "SELECT * from psihodelici WHERE psy_id = ?";
    var id = req.param("id");
    connection.query(sql ,id , function(err, rows) {
        if (!err) {
            res.render('backend/editpsy', {title: 'Admin', id: id, data: rows});
        }
        else {
            console.log('Error while performing Query.');
        }
    });
});

router.get('/:id',loggedin, function(req, res, next) {
    var sql = "SELECT * from novosti WHERE novosti_id = ?";
    var id = req.param("id");
    connection.query(sql ,id , function(err, rows) {
        if (!err) {
            res.render('backend/editnovosti', {title: 'Admin', id: id, data: rows});
        }
        else {
            console.log('Error while performing Query.');
        }
    });
});


/* POST update page. */
router.post('/submit', function (req, res, next) {
    var today = new Date().toISOString().slice(0,-14);
    console.log(today);
    var sql = "UPDATE `novosti` SET ? WHERE novosti_id = ?";
    var id = req.body.id;
    var post  = {title: req.body.title, description: req.body.description, img: req.body.img, author:req.body.author, created_on:today};
    connection.query(sql,[post,id], function (err, result) {
        if (!err) {

            res.redirect('/update');
        }
        else {
            console.log(err);
        }
    });

});



router.post('/submiti', function (req, res, next) {

    var sql = "UPDATE `iskustva` SET ? WHERE iskustvo_id = ?";
    var id = req.body.id;
    var post  = {title: req.body.title, description: req.body.description, author: req.body.author, location: req.body.location, substance: req.body.substance };
    connection.query(sql,[post,id], function (err, result) {
        if (!err) {

            res.redirect('/update/iskustva');
        }
        else {
            console.log(err);
        }
    });

});

router.post('/submitp', function (req, res, next) {

    var sql = "UPDATE `psihodelici` SET ? WHERE psy_id = ?";
    var id = req.body.id;
    var post  = {
        name: req.body.name,
        subname: req.body.subname,
        img: req.body.img,
        istorijat: req.body.istorijat,
        upotreba: req.body.upotreba,
        efekti: req.body.efekti,
        farmakologija: req.body.farmakologija,
        mitovi: req.body.mitovi,
        svojstva: req.body.svojstva,
        toksicnost: req.body.toksicnost

    };
    connection.query(sql,[post,id], function (err, result) {
        if (!err) {

            res.redirect('/update/psihodelici');
        }
        else {
            console.log(err);
        }
    });

});

module.exports = router;