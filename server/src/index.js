import "dotenv/config";
import cors from "cors";
import express from "express";
import { prisma } from "./lib/prisma.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import ownerRoutes from "./routes/owner.js";
import storeRoutes from "./routes/stores.js";

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

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/owner", ownerRoutes);

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

const server = app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Stop the other process or set PORT in server/.env`
    );
    process.exit(1);
  }
  throw err;
});
