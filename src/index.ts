import express from "express";
import * as dotenv from "dotenv";
import { startBot } from "./services/telegramBot";
import menuRoutes from "./routes/menu";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/menu", menuRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

startBot();