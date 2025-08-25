const express = require("express");
const {
  createUserType,
  getAllUserTypes,
  getUserTypeById,
  updateUserType,
  deleteUserType,
} = require("../controllers/userTypeController");

const router = express.Router();

// Create a new user type
router.post("/", createUserType);

// Get all user types
router.get("/", getAllUserTypes);

// Get a user type by ID
router.get("/:idUserType", getUserTypeById);

// Update a user type
router.put("/:idUserType", updateUserType);

// Delete a user type
router.delete("/:idUserType", deleteUserType);

module.exports = router;
