const express = require("express");
const {
  getAllAgeCategories,
  getAgeCategoryById,
  createAgeCategory,
  updateAgeCategory,
  deleteAgeCategory,
} = require("../controllers/ageCategoryController");

const router = express.Router();

router.get("/", getAllAgeCategories);
router.get("/:idAgeCategory", getAgeCategoryById);
router.post("/", createAgeCategory);
router.put("/:idAgeCategory", updateAgeCategory);
router.delete("/:idAgeCategory", deleteAgeCategory);

module.exports = router;
