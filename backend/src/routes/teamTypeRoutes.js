const express = require("express");
const {
  getAllTeamTypes,
  getTeamTypeById,
  createTeamType,
  updateTeamType,
  deleteTeamType,
} = require("../controllers/teamTypeController");

const router = express.Router();

// Get all team types
router.get("/", getAllTeamTypes);

// Get a team type by ID
router.get("/:idTeamType", getTeamTypeById);

// Create a new team type
router.post("/", createTeamType);

// Update a team type
router.put("/:idTeamType", updateTeamType);

// Delete a team type
router.delete("/:idTeamType", deleteTeamType);

module.exports = router;
