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

/* GET home page. */
router.get('/', function (req, res, next) {
    var sql = "SELECT novosti.novosti_id, novosti.title, novosti.description, novosti.img, novosti.category, novosti.created_on, slike.img_name FROM novosti LEFT JOIN slike ON novosti.img=slike.img_id ORDER BY novosti_id DESC LIMIT 6";
    connection.query(sql, function(err, rows) {
        if (!err) {
            connection.query('SELECT novosti.novosti_id, novosti.title, novosti.description, novosti.category, novosti.author, novosti.img, novosti.created_on, slike.img_name from novosti LEFT JOIN slike ON novosti.img=slike.img_id WHERE novosti.category = "nauka" ORDER BY novosti_id DESC LIMIT 3', function(err, rows2) {
                connection.query('SELECT novosti.novosti_id, novosti.title, novosti.description, novosti.category, novosti.author, novosti.img, novosti.created_on, slike.img_name from novosti LEFT JOIN slike ON novosti.img=slike.img_id WHERE novosti.category = "kultura" ORDER BY novosti_id DESC LIMIT 3', function(err, rows3) {
                    connection.query('SELECT id FROM komentari', function(err, rows4) {

                        console.log(rows4);
                        res.render('index', { title: 'Psajt', data: rows, data2: rows2, data3: rows3, data4: rows4 });

                    });
                });
            });

        }
        else {
            console.log('Error while performing Query.');
        }

    });
});


router.get('/login', function (req, res, next) {
  res.render('login');
});


router.get('/signup',loggedin, function (req, res, next) {
  res.render('signup');
});


router.get('/profile', loggedin, function (req, res, next) {
  res.render('profile', {
    user: req.user
  })
});


router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})
module.exports = router;