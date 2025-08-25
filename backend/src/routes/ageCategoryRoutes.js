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
router.get("/:idCategory", getAgeCategoryById);
router.post("/", createAgeCategory);
router.put("/:idCategory", updateAgeCategory);
router.delete("/:idCategory", deleteAgeCategory);

module.exports = router;
