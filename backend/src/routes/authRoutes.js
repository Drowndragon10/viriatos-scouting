const express = require("express");
const {
  login,
  register,
  users,
  updateName,
  userData,
} = require("../controllers/authController");
const {
  inviteUser,
  createAccount,
} = require("../controllers/userInviteController");

const router = express.Router();

// Auth
router.post("/login", login);
router.post("/register", register);
router.put("/user/:idUser", updateName);
router.get("/users", users);
router.get("/user/:idUser", userData);

// Invitations
router.post("/invite", inviteUser);
router.post("/registerInvite", createAccount);

module.exports = router;
