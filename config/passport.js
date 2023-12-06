// passport.js

import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import passport from 'passport'; 

const configurePassport = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'username', passwordField: 'pwd', passReqToCallback: false }, (username, pwd, done) => {
      // Match user
      User.findOne({
        username: username
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That username is not registered' });
        }

        // Match password
        bcrypt.compare(pwd, user.pwd, (err, isMatch) => {
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

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      if (err) {
        return done(err);
      }
      return done(null, user);
    });
  });
};

export { configurePassport, LocalStrategy, bcrypt, User, passport };