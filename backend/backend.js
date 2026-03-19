import express from "express";
import { db } from "./db/mongo.js";
import userRouter from "./routes/userRouter.js";
import listRouter from "./routes/listRouter.js";
import gamesRouter from "./routes/gamesRouter.js";

// try {
//   process.loadEnvFile();
// } catch {
//   console.log("Unable to load env file. Ignore if in production!");
// }
const PORT = process.env.PORT || 3000;

if (!db) {
  console.error("MongoDB database not initialized. Exiting.");
  process.exit(1);
}
if (!userRouter || !listRouter || !gamesRouter) {
  console.error("Not all routers loaded!");
  process.exit(1);
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("dist"));
app.use("/api/user", userRouter);
app.use("/api/list", listRouter);
app.use("/api/games", gamesRouter);
app.listen(PORT, () => {
  console.log("Server running in port ", PORT);
});

export default app;
