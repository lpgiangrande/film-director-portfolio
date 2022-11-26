const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
      new LocalStrategy({ usernameField: 'username', passwordField: "pwd",  passReqToCallback: false}, (username, pwd, done) => {
        // Match user
        User.findOne({
          username : username
        }).then(user => {
          if (!user) {
            return done(null, false, { message: 'That username is not registered' });
          }
  
          // Match password
          bcrypt.compare(pwd, user.pwd, (err, isMatch) => { // isMatch = boolean
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Incorrect password' });
            }
          });
        });
      })
    );

    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
  
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        if (err) { 
          return done(err);
        }
        return done(null, user);
      });
    });
  };