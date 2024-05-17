const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function createToken(id) {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: "1d" });
}

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/user/github/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ username: profile.username });
        console.log("profile: ", profile);
        const token = createToken(profile.id);
        if (!user) {
          const newUser = await User.create({
            githubId: profile?.id,
            username: profile?.username,
            email: profile?.profileUrl,
            avtar: profile?.photos?.[0].value,
            token,
          });

          console.log("newUser" , newUser);
          if(newUser) {
            done(null, newUser);
          }
        } else {
          done(null, user);
        }
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/user/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ username: profile.displayName });
        const token = createToken(profile.id);
        if (!user) {
          const newUser = await User.create({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            avtar: profile.photos[0].value,
            token,
          });
          if(newUser) {
            done(null, newUser);
          }
        } else {
          done(null, user);
        }
      } catch (err) {
        done(err, null);
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
    done(err, null);
  }
});
