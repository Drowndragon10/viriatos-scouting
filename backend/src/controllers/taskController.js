const Match = require('../models/match');
const User = require('../models/user');
const Athlete = require('../models/athlete');
const Task = require('../models/task');

// Create a new task
const createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body);
        return res.status(201).json(task);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get all tasks
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            include: [
                { model: Match, as: 'match' },
                { model: User, as: 'user' },
                { model: Athlete, as: 'athlete' },
            ],
        });
        return res.status(200).json(tasks);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get tasks by user
const getTasksByUser = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            where: { idUser: req.params.id },
            include: [
                { model: Match, as: 'match' },
                { model: User, as: 'user' },
                { model: Athlete, as: 'athlete' },
            ],
        });
        return res.status(200).json(tasks);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createTask,
    getTasks,
    getTasksByUser,
};
