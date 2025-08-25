const express = require("express");
const {
  getAthletes,
  getAthleteById,
  getAthletesByTeam,
  createAthlete,
  updateAthlete,
  deleteAthlete,
} = require("../controllers/athleteController");

const router = express.Router();

router.get("/", getAthletes);
router.get("/:idAthlete", getAthleteById);
router.get("/team/:idTeam", getAthletesByTeam);
router.post("/", createAthlete);
router.put("/:idAthlete", updateAthlete);
router.delete("/:idAthlete", deleteAthlete);

module.exports = router;
