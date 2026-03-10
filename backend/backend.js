import express from 'express';

try {
  process.loadEnvFile();
} catch {
  console.log("Unable to load env file. Not needed if this is in production!");
}

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(PORT, () => {
  console.log("Server running in port ", PORT);
});

export default app;