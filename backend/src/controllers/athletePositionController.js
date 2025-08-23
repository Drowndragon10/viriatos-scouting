const Position = require('../models/position');

const getAllPositions = async (req, res) => {
  try {
    const positions = await Position.findAll();
    return res.status(200).json(positions);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching positions.', error });
  }
};

const getPositionById = async (req, res) => {
  try {
    const { idPosition } = req.params;
    const position = await Position.findByPk(idPosition);
    if (!position) {
      return res.status(404).json({ message: 'Position not found.' });
    }
    res.status(200).json(position);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching position.', error });
  }
};

const createPosition = async (req, res) => {
  try {
    const { name } = req.body;
    const newPosition = await Position.create({ name });
    res.status(201).json(newPosition);
  } catch (error) {
    res.status(500).json({ message: 'Error creating position.', error });
  }
};

const updatePosition = async (req, res) => {
  try {
    const { idPosition } = req.params;
    const { name } = req.body;
    const position = await Position.findByPk(idPosition);
    if (!position) {
      return res.status(404).json({ message: 'Position not found.' });
    }
    position.name = name;
    await position.save();
    res.status(200).json(position);
  } catch (error) {
    res.status(500).json({ message: 'Error updating position.', error });
  }
};

const deletePosition = async (req, res) => {
  try {
    const { idPosition } = req.params;
    const position = await Position.findByPk(idPosition);
    if (!position) {
      return res.status(404).json({ message: 'Position not found.' });
    }
    await position.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting position.', error });
  }
};

module.exports = {
  getAllPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition,
};
