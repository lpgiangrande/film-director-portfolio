import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import passport from 'passport';

const configurePassport = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: 'username', passwordField: 'pwd', passReqToCallback: false },
      async (username, pwd, done) => {
        try {
          const user = await User.findOne({ username: username });
          if (!user) {
            return done(null, false, { message: 'That username is not registered' });
          }

          const isMatch = await bcrypt.compare(pwd, user.pwd);
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Incorrect password' });
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};

export { configurePassport, LocalStrategy, bcrypt, User, passport };
