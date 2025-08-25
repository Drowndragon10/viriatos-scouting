const express = require("express");
const {
  createMatchTeams,
  listMatches,
  listMatch,
  updateMatch,
  deleteMatch,
  listMatchesByCategory,
} = require("../controllers/matchController");

const router = express.Router();

// Create a match with teams
router.post("/", createMatchTeams);

// Get all matches
router.get("/", listMatches);

// Get a specific match
router.get("/:idMatch", listMatch);

// Update a match
router.put("/:idMatch", updateMatch);

// Delete a match
router.delete("/:idMatch", deleteMatch);

// Get matches by category
router.get("/category/:idAgeCategory", listMatchesByCategory);

module.exports = router;
