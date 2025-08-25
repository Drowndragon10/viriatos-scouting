const TeamType = require('../models/teamType');

const getAllTeamTypes = async (req, res) => {
    try {
        const teamTypes = await TeamType.findAll();
        return res.status(200).json(teamTypes);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching team types.', error });
    }
};

const getTeamTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const teamType = await TeamType.findByPk(id);
        if (!teamType) {
            return res.status(404).json({ message: 'Team type not found.' });
        }
        res.status(200).json(teamType);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching team type.', error });
    }
};

const createTeamType = async (req, res) => {
    try {
        const { name } = req.body;
        const newTeamType = await TeamType.create({ name });
        res.status(201).json(newTeamType);
    } catch (error) {
        res.status(500).json({ message: 'Error creating team type.', error });
    }
};

const updateTeamType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const teamType = await TeamType.findByPk(id);
        if (!teamType) {
            return res.status(404).json({ message: 'Team type not found.' });
        }
        teamType.name = name;
        await teamType.save();
        res.status(200).json(teamType);
    } catch (error) {
        res.status(500).json({ message: 'Error updating team type.', error });
    }
};

const deleteTeamType = async (req, res) => {
    try {
        const { id } = req.params;
        const teamType = await TeamType.findByPk(id);
        if (!teamType) {
            return res.status(404).json({ message: 'Team type not found.' });
        }
        await teamType.destroy();
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting team type.', error });
    }
};

module.exports = {
    getAllTeamTypes,
    getTeamTypeById,
    createTeamType,
    updateTeamType,
    deleteTeamType,
};
