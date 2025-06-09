const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// Serialize/Deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy - ONLY if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      
      if (user) {
        return done(null, user);
      }
      
      // Check if user exists with same email
      user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        // Link Google account to existing user
        user.googleId = profile.id;
        await user.save();
        return done(null, user);
      }
      
      // Create new user
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
        provider: 'google'
      });
      
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }));
} else {
  console.warn('Google OAuth credentials not found. Google login will be disabled.');
}

// Facebook OAuth Strategy - ONLY if credentials are provided
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/api/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ facebookId: profile.id });
      
      if (user) {
        return done(null, user);
      }
      
      // Check if user exists with same email
      const email = profile.emails?.[0]?.value;
      if (email) {
        user = await User.findOne({ email });
        if (user) {
          // Link Facebook account to existing user
          user.facebookId = profile.id;
          await user.save();
          return done(null, user);
        }
      }
      
      // Create new user
      user = await User.create({
        facebookId: profile.id,
        name: profile.displayName,
        email: email,
        avatar: profile.photos?.[0]?.value,
        provider: 'facebook'
      });
      
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }));
} else {
  console.warn('Facebook OAuth credentials not found. Facebook login will be disabled.');
}

// GitHub OAuth Strategy - ONLY if credentials are provided
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/api/auth/github/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ githubId: profile.id });
      
      if (user) {
        return done(null, user);
      }
      
      // Check if user exists with same email
      const email = profile.emails?.[0]?.value;
      if (email) {
        user = await User.findOne({ email });
        if (user) {
          // Link GitHub account to existing user
          user.githubId = profile.id;
          await user.save();
          return done(null, user);
        }
      }
      
      // Create new user
      user = await User.create({
        githubId: profile.id,
        name: profile.displayName || profile.username,
        email: email,
        avatar: profile.photos?.[0]?.value,
        provider: 'github'
      });
      
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }));
} else {
  console.warn('GitHub OAuth credentials not found. GitHub login will be disabled.');
}

module.exports = passport;
