import express from "express";
import { db } from "./db/mongo.js";
import userRouter from "./routes/userRouter.js";
import listRouter from "./routes/listRouter.js";
import gamesRouter from "./routes/gamesRouter.js";
import path from 'path';
import {fileURLToPath} from 'url';

// try {
//   process.loadEnvFile();
// } catch {
//   console.log("Unable to load env file. Ignore if in production!");
// }

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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


app.use("/api/user", userRouter);
app.use("/api/list", listRouter);
app.use("/api/games", gamesRouter);

app.use(express.static(path.join(__dirname, "dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log("Server running in port ", PORT);
});

export default app;
