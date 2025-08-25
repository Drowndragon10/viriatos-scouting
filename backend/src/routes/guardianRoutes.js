const express = require("express");
const {
  getAllGuardians,
  createGuardian,
  getGuardianById,
  updateGuardian,
  deleteGuardian,
} = require("../controllers/guardianController");

const router = express.Router();

router.get("/", getAllGuardians);
router.post("/", createGuardian);
router.get("/:idGuardian", getGuardianById);
router.put("/:idGuardian", updateGuardian);
router.delete("/:idGuardian", deleteGuardian);

module.exports = router;
