const express = require("express");
const {
  getTeamsByCoach,
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
} = require("../controllers/teamController");

const router = express.Router();

// Get all teams
router.get("/", getTeams);

// Create a new team
router.post("/", createTeam);

// Get a specific team
router.get("/:idTeam", getTeamById);

// Update a team
router.put("/:idTeam", updateTeam);

// Delete a team
router.delete("/:idTeam", deleteTeam);

// Get teams by coach (user)
router.get("/coach/:idUser", getTeamsByCoach);

module.exports = router;
