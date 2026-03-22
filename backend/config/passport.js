import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { getUserByUsername, getUser } from "../services/userService.js";

const strategy = new LocalStrategy(
  { usernameField: "username", passwordField: "password" },
  async (username, password, done) => {
    console.log("using strategy: ", username, password);
    //Case 1: there is an error
    try {
      const user = await getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: "User or password incorrect" });
      }
      const isValidPassword = await bcrypt.compare(
        password,
        user.password_hash,
      );
      if (!isValidPassword) {
        console.log("mismatch in passwords!");
        return done(null, false, { message: "User or password incorrect" });
      }
      delete user.password_hash;
      //console.log("strategy success: ", user);
      return done(null, user);
    } catch (error) {
      done(error);
    }
  },
);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.userID);
});

//retrieve full user object
passport.deserializeUser(async (userID, done) => {
  console.log("deserializing userID", userID);
  try {
    const user = await getUser(userID);
    done(null, user); //attach user objecto the req.user
  } catch (error) {
    done(error);
  }
});

export default passport;
