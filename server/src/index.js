import "dotenv/config";
import cors from "cors";
import express from "express";
import { prisma } from "./lib/prisma.js";

const app = express();
const PORT = process.env.PORT || 5001;
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, service: "storeRate-api", database: "connected" });
  } catch {
    res.status(503).json({
      ok: false,
      service: "storeRate-api",
      database: "disconnected",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
