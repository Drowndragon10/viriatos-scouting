const express = require("express");
const {
  getReports,
  getReportById,
  createReport,
  getReportsByUserId,
  approveReport,
  rejectReport,
  getReportByAthleteId,
} = require("../controllers/reportController");

const router = express.Router();

// Get all reports
router.get("/", getReports);

// Get a specific report by ID
router.get("/:idReport", getReportById);

// Create a new report for an athlete
router.post("/:idAthlete", createReport);

// Get reports by user ID
router.get("/user/:idUser", getReportsByUserId);

// Accept a report
router.put("/accept/:idReport", approveReport);

// Reject a report
router.put("/reject/:idReport", rejectReport);

// Get reports by athlete ID
router.get("/athlete/:idAthlete", getReportByAthleteId);

module.exports = router;
