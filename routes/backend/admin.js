var express = require('express');
var router = express.Router();


var loggedin = function (req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/login')
    }
}

router.get('/', loggedin, function (req, res, next) {
    res.render('backend/admin', {
        user: req.user
    })
});


router.get('/login', function (req, res, next) {
    res.render('login');
});


router.get('/signup', loggedin, function (req, res, next) {
    res.render('signup');
});





router.get('/logout', function (req, res) {
    req.logout()
    res.redirect('/')
})
module.exports = router;