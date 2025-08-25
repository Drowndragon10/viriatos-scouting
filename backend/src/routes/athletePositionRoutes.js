const express = require("express");
const {
  getAllPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition,
} = require("../controllers/athletePositionController");

const router = express.Router();

// Get all positions
router.get("/", getAllPositions);

// Get a specific position
router.get("/:idPosition", getPositionById);

// Create a new position
router.post("/", createPosition);

// Update a position
router.put("/:idPosition", updatePosition);

// Delete a position
router.delete("/:idPosition", deletePosition);

module.exports = router;
