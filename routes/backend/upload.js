var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');

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
            res.render('backend/upload', { title: 'View', data: rows, user: req.user });
        }
        else {
            console.log('Error while performing Query.');
        }

    });
});

router.use(fileUpload());

router.post('/upload', function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    var img = req.files.img;
    console.log(img);
    if(img.length === undefined){
        img.mv("../public/images/upload/" + img.name, function (err) {
            if (err)
                return res.status(500).send(err);


            var sql = "INSERT INTO `slike` SET ?";
            var post  = {img_name: img.name };
            connection.query(sql,post, function (err, result) {
                if (!err) {
                    res.redirect('/create');
                }
                else {
                    console.log(err);
                }
            });

        });
    }
    else {

        img.forEach(function(slika) {
            // Use the mv() method to place the file somewhere on your server
            slika.mv("../public/images/upload/" + slika.name, function (err) {
                if (err)
                    return res.status(500).send(err);


                var sql = "INSERT INTO `slike` SET ?";
                var post  = {name: slika.name };
                connection.query(sql,post, function (err, result) {
                    if (!err) {
                        res.redirect('/create');
                    }
                    else {
                        console.log(err);
                    }
                });

            });
        });
        res.redirect('/create');
    }

});


module.exports = router;