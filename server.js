var express = require('express');
var connect = require('connect');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash  = require('connect-flash');
var    passport            = require('passport');
var mongoose = require('mongoose');



 app = express();
var allowedHeaders = 'Content-Type';
require('./passport')(passport);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

app.use(session({
    secret: 'ilovelittlecats',
}));


mongoose.connect('mongodb://127.0.0.1:27017/appdb', function(err) {
  if (err) {
    console.log('Could not connect to mongodb on localhost. Ensure that you have mongodb running on localhost and mongodb accepts connections on standard ports!');
  }
});



app.get('/', function(req, res) {
    res.status(200).sendfile('./public/index.html');
});


app.get('/signup-successfully', function(req, res) {
    res.status(200).send(JSON.stringify(req.user));
});

app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/signup-successfully', // redirect to the secure profile section
    failureRedirect : '/signup-failed', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));


app.get('/signup-failed', function(req, res) {
    req.logout();
    res.status(500).send('');
});
app.get('/signup-successfully', function(req, res) {
    res.status(200).send(JSON.stringify(req.user));
});



app.get('/signin-failed', function(req, res) {
    req.logout();
    res.status(500).send('');
});

app.get('/signin-successfully', function(req, res) {
    res.status(200).send(JSON.stringify(req.user));
});

app.post('/signin', passport.authenticate('local-login', {
    successRedirect : '/signin-successfully', // redirect to the secure profile section
    failureRedirect : '/signin-failed', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}),
    function(req, res) {
        if (req.body.remember) {
            req.session.cookie.maxAge = 1000 * 60 * 3;
        } else {
            req.session.cookie.expires = false;
        }
        res.redirect('/signin-successfully');
    });

app.listen(3000);
