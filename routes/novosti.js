var express = require('express');
var router = express.Router();
var dateFormat = require('dateformat');


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
connection.query('SELECT novosti.novosti_id, novosti.title, novosti.description,novosti.category, novosti.author, novosti.img, novosti.created_on, slike.img_name FROM novosti LEFT JOIN slike ON novosti.img=slike.img_id ORDER BY novosti_id DESC', function(err, rows) {
    if (!err){
        connection.query('SELECT id from komentari', function(err, rows2) {
            router.get('/', function(req, res, next) {

                res.render('novosti', { title: 'Psajt', data: rows, data2: rows2});
        });
    });}
    else{
        console.log('Error while performing Querydd.');
    }

});

router.get('/:cat', function(req, res, next) {
    var sql = "SELECT novosti.novosti_id, novosti.title, novosti.description, novosti.category, novosti.author, novosti.img, novosti.created_on, slike.img_name from novosti LEFT JOIN slike ON novosti.img=slike.img_id WHERE novosti.category = ?  ORDER BY novosti_id DESC";
    var cat = req.param("cat");
    connection.query(sql ,cat , function(err, rows) {
        if (!err) {

            connection.query('SELECT id from komentari', function(err, rows2) {
                console.log(rows2);

                res.render('novosticat', {title: 'Psajdt', cat: cat, data: rows, data2:rows2 });

            });
        }
        else {
            console.log('Error while performing Query.');
        }
    });
});

router.get('/:cat/:id', function(req, res, next) {
    var sql = "SELECT novosti.novosti_id, novosti.title, novosti.description, novosti.category, novosti.author, novosti.img, novosti.created_on, slike.img_name, komentari.name, komentari.text FROM novosti LEFT JOIN slike ON novosti.img=slike.img_id LEFT JOIN komentari ON novosti.novosti_id=komentari.id WHERE novosti.novosti_id = ?";
    var id = req.param("id");
    var cat = req.param("cat");

    connection.query(sql ,id , function(err, rows) {
        if (!err) {
            connection.query('SELECT novosti.novosti_id, novosti.title, novosti.category, novosti.img, novosti.created_on, slike.img_name from novosti LEFT JOIN slike ON novosti.img=slike.img_id ORDER BY novosti.created_on DESC LIMIT 3', function(err, rows2) {
                connection.query('SELECT novosti.novosti_id, novosti.title, novosti.category, novosti.img, novosti.comments, novosti.created_on, slike.img_name from novosti LEFT JOIN slike ON novosti.img=slike.img_id ORDER BY novosti.comments DESC LIMIT 3', function(err, rows3) {
                    connection.query('SELECT id FROM komentari', function(err, rows4) {

                        console.log(rows3);

                        res.render('novost', {
                            title: 'Psajt',
                            id: id,
                            cat: cat,
                            data: rows,
                            data2: rows2,
                            data3: rows3,
                            data4: rows4
                        });
                    });
                });
            });
        }
        else {
            console.log('Error while performing Query.');
        }
    });
});






/* POST submit komentara */
router.post('/submit', function (req, res, next) {
    var today = new Date();
    var sql = "INSERT INTO `komentari` SET ?";
    var post  = {name: req.body.name, text: req.body.comment, category: "novosti", id:req.body.id, comcreated_on:today };
    connection.query(sql,post, function (err, result) {
        if (!err) {
            connection.query('UPDATE `novosti` SET ? WHERE novosti_id = ?',[{comments: req.body.comm},req.body.id], function(err, rows4) {
                res.redirect('/novosti/' + req.body.cat + "/"+ req.body.id);
            });
        }
        else {
            console.log(err);
        }
    });

});

module.exports = router;
