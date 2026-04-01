const express = require("express");
const Analysis = require("../models/analysis");
const { protect } = require("../middleware/auth");

const router = express.Router();

// GET /api/history
router.get("/", protect, async (req, res) => {
  try {
    const analyses = await Analysis.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .select("-input.resumeText");
    res.json(analyses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/history/:id
router.get("/:id", protect, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!analysis)
      return res.status(404).json({ message: "Analysis not found" });
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/history/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const analysis = await Analysis.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!analysis)
      return res.status(404).json({ message: "Analysis not found" });
    res.json({ message: "Analysis deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;