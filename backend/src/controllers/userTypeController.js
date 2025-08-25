const UserType = require('../models/userType');

// Create a new UserType
const createUserType = async (req, res) => {
    try {
        const { name } = req.body;
        const newUserType = await UserType.create({ name });
        res.status(201).json(newUserType);
    } catch (error) {
        res.status(500).json({ error: 'Error creating user type.' });
    }
};

// Get all UserTypes
const getAllUserTypes = async (req, res) => {
    try {
        const userTypes = await UserType.findAll();
        res.status(200).json(userTypes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user types.' });
    }
};

// Get UserType by ID
const getUserTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const userType = await UserType.findByPk(id);
        if (!userType) {
            return res.status(404).json({ error: 'User type not found.' });
        }
        res.status(200).json(userType);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user type.' });
    }
};

// Update UserType
const updateUserType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const userType = await UserType.findByPk(id);

        if (!userType) {
            return res.status(404).json({ error: 'User type not found.' });
        }

        await userType.update({ name });
        res.status(200).json(userType);
    } catch (error) {
        res.status(500).json({ error: 'Error updating user type.' });
    }
};

// Delete UserType
const deleteUserType = async (req, res) => {
    try {
        const { id } = req.params;
        const userType = await UserType.findByPk(id);

        if (!userType) {
            return res.status(404).json({ error: 'User type not found.' });
        }

        await userType.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user type.' });
    }
};

module.exports = {
    createUserType,
    getAllUserTypes,
    getUserTypeById,
    updateUserType,
    deleteUserType
};
