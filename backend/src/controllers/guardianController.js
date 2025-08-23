const Guardian = require('../models/guardian');

// 📌 Create Guardian
const createGuardian = async (req, res) => {
    try {
        const { name, contact, email } = req.body;

        if (!name || !contact || !email) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newGuardian = await Guardian.create({ name, contact, email });

        return res.status(201).json(newGuardian);
    } catch (error) {
        console.error('Error creating guardian:', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Email is already in use.' });
        }

        return res.status(500).json({ message: 'Error creating guardian.', error });
    }
};

// 📌 Get All Guardians
const getAllGuardians = async (req, res) => {
    try {
        const guardians = await Guardian.findAll();
        return res.status(200).json(guardians);
    } catch (error) {
        console.error('Error fetching guardians:', error);
        return res.status(500).json({ message: 'Error fetching guardians.', error });
    }
};

// 📌 Get Guardian by ID
const getGuardianById = async (req, res) => {
    try {
        const { guardianId } = req.params;
        const guardian = await Guardian.findByPk(guardianId);

        if (!guardian) {
            return res.status(404).json({ message: 'Guardian not found.' });
        }

        return res.status(200).json(guardian);
    } catch (error) {
        console.error('Error fetching guardian:', error);
        return res.status(500).json({ message: 'Error fetching guardian.', error });
    }
};

// 📌 Update Guardian
const updateGuardian = async (req, res) => {
    try {
        const { guardianId } = req.params;
        const { name, contact, email } = req.body;

        const guardian = await Guardian.findByPk(guardianId);

        if (!guardian) {
            return res.status(404).json({ message: 'Guardian not found.' });
        }

        guardian.name = name || guardian.name;
        guardian.contact = contact || guardian.contact;
        guardian.email = email || guardian.email;

        await guardian.save();

        return res.status(200).json(guardian);
    } catch (error) {
        console.error('Error updating guardian:', error);
        return res.status(500).json({ message: 'Error updating guardian.', error });
    }
};

// 📌 Delete Guardian
const deleteGuardian = async (req, res) => {
    try {
        const { guardianId } = req.params;
        const guardian = await Guardian.findByPk(guardianId);

        if (!guardian) {
            return res.status(404).json({ message: 'Guardian not found.' });
        }

        await guardian.destroy();

        return res.status(204).end();
    } catch (error) {
        console.error('Error deleting guardian:', error);
        return res.status(500).json({ message: 'Error deleting guardian.', error });
    }
};

module.exports = {
    createGuardian,
    getAllGuardians,
    getGuardianById,
    updateGuardian,
    deleteGuardian,
};
