// config/passport.js
var passport       = require('passport');
// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

    var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;
   // load up the user model
    bcrypt = require('bcrypt-nodejs'),
    connection = require('./db_connect').localConnect();

    var users;
    var db =  MongoClient.connect('mongodb://127.0.0.1:27017/appdb', function (err, db) {
         if (err) {
            throw err;
        } else {
        console.log("successfully connected to the database ");
        users = db.collection('users');
        }
        
});

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        users.find({'_id':id},function(err,user){
            done(err,user);
        });
        // connection.query("select * from users where id = "+ id, function(err, rows){
        //     done(err, rows[0]);
        // });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
 passport.use(
        'local-signup',
        new LocalStrategy({
                // by default, local strategy uses username and password, we will override with email
                usernameField : 'userName',
                passwordField : 'password',
                passReqToCallback : true // allows us to pass back the entire request to the callback
            },
            function(req, username, password, done) {
                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                console.log(username);
                users.find({userName:username}).toArray(function(err, rows) {
                    if (err)
                        return done(err);
                    console.log(rows.length);
                    if (rows.length>0) {
                        return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                    } else {
                        // if there is no user with that username
                        // create the user
                        var newUserMysql = {
                            userName: username,
                            password: password  // use the generateHash function in our user model
                        };

                        //var insertQuery = "INSERT INTO users ( username, password ) values ('" + newUserMysql.username + "','" + newUserMysql.password + "')";

                            users.save(newUserMysql, {safe:true},function(err, rows) {
                            newUserMysql.id = rows._id;

                            return done(null, newUserMysql);
                        });
                    }
                });
            })
    );

    passport.use(
        'local-login',
        new LocalStrategy({
                // by default, local strategy uses username and password, we will override with email
                usernameField : 'userName',
                passwordField : 'password',
                passReqToCallback : true // allows us to pass back the entire request to the callback
            },
            function(req, username, password, done) { // callback with email and password from our form
                users.find({"userName":username}).toArray(function(err, rows){
                    if (err)
                        return done(err);
                    console.log(rows);
                    if (!rows.length) {
                        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                    }

                    // if the user is found but the password is wrong
                    if (password != rows[0].password)
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                    // all is well, return successful user
                    return done(null, rows[0]);
                });

            })
    );
}