require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const historyRoutes = require("./routes/historyRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Connect to MongoDB ────────────────────────────────────────
connectDB();

// ── Routes ────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/history", historyRoutes);

app.get("/", (req, res) => {
  res.json({ status: "AI Career Assistant API is running" });
});

// ── Start server ──────────────────────────────────────────────
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));