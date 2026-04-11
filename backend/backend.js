import express from "express";
import session from "express-session";

import path from "path";
import { fileURLToPath } from "url";
import passport from "./config/passport.js";
import { db } from "./db/mongo.js";
import userRouter from "./routes/userRouter.js";
import listRouter from "./routes/listRouter.js";
import gamesRouter from "./routes/gamesRouter.js";

if (!db) {
  console.error("MongoDB database not initialized. Exiting.");
  process.exit(1);
} else if (!userRouter || !listRouter || !gamesRouter) {
  console.error("Not all routers loaded!");
  process.exit(1);
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const app = express();

//Middlewarae
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Session configuration
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, //TODO set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, //24 hours
    },
  }),
);

//Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

//Static and api routes
app.use(express.static("../frontend/dist"));
app.use("/api/user", userRouter);
app.use("/api/list", listRouter);
app.use("/api/games", gamesRouter);

app.listen(PORT, () => {
  console.log("Server running in port ", PORT);
});

export default app;
