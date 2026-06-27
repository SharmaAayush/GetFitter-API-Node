import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import { User } from '@/models/user.model';
import config from '@/config/env';
import logger from '@/services/logger';

const { JWT_SECRET } = config;

// 1. Local Strategy: For Email/Password Login
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } });
        if (!user || !await bcrypt.compare(password, user.password)) {
          return done(null, false, { message: 'Incorrect email or password.' });
        }

        return done(null, await user.transform());
      } catch (error) {
        logger.error(`Unhandled error in passport LocalStrategy`);
        logger.debug(error);
        return done(error);
      }
    }
  )
);

// 2. JWT Strategy: For protecting subsequent API requests
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Checks 'Authorization: Bearer <TOKEN>'
      secretOrKey: JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        const user = await User.findByPk(jwtPayload.id);
        if (user) {
          return done(null, await user.transform());
        }
        return done(null, false);
      } catch (error) {
        logger.error(`Unhandled error in passport JwtStrategy`);
        logger.debug(error);
        return done(error);
      }
    }
  )
);

export default passport;