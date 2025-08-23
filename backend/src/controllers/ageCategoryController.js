const AgeCategory = require('../models/ageCategory');

// Get all age categories
const getAllAgeCategories = async (req, res) => {
    try {
        const categories = await AgeCategory.findAll();
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching age categories.', error });
    }
};

// Get age category by ID
const getAgeCategoryById = async (req, res) => {
    try {
        const { idAgeCategory } = req.params;
        const category = await AgeCategory.findByPk(idAgeCategory);
        if (!category) {
            return res.status(404).json({ message: 'Age category not found.' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching age category.', error });
    }
};

// Create a new age category
const createAgeCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const newCategory = await AgeCategory.create({ name });
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error creating age category.', error });
    }
};

// Update age category
const updateAgeCategory = async (req, res) => {
    try {
        const { idAgeCategory } = req.params;
        const { name } = req.body;
        const category = await AgeCategory.findByPk(idAgeCategory);
        if (!category) {
            return res.status(404).json({ message: 'Age category not found.' });
        }
        category.name = name;
        await category.save();
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error updating age category.', error });
    }
};

// Delete age category
const deleteAgeCategory = async (req, res) => {
    try {
        const { idAgeCategory } = req.params;
        const category = await AgeCategory.findByPk(idAgeCategory);
        if (!category) {
            return res.status(404).json({ message: 'Age category not found.' });
        }
        await category.destroy();
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting age category.', error });
    }
};

module.exports = {
    getAllAgeCategories,
    getAgeCategoryById,
    createAgeCategory,
    updateAgeCategory,
    deleteAgeCategory,
};
