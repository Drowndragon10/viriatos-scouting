const express = require("express");
const { getUsersData, block, unblock, updateRole} = require("../controllers/adminController");

const router = express.Router();

router.get("/", getUsersData);

router.put("/users/block/:idUser", block);

router.put("/users/unblock/:idUser", unblock);

router.put("/users/updateRole/:idUser", updateRole);

module.exports = router;
