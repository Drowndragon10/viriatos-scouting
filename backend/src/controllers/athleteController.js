const Athlete = require('../models/athlete');
const Position = require('../models/position');
const Guardian = require('../models/guardian');
const Team = require('../models/team');
const Task = require('../models/task');

// Get all athletes
const getAthletes = async (req, res) => {
    try {
        const athletes = await Athlete.findAll({
            include: [
                { model: Position, as: 'position' },
                { model: Guardian, as: 'guardian' },
                { model: Team, as: 'team' },
            ],
        });
        res.json(athletes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get athletes by team
const getAthletesByTeam = async (req, res) => {
    const { idTeam } = req.params;

    try {
        const athletes = await Athlete.findAll({
            where: { idTeam },
            attributes: ['idAthlete', 'name', 'rating'],
            include: [
                {
                    model: Position,
                    as: 'position',
                    attributes: ['name'],
                },
            ],
        });

        if (athletes.length === 0) {
            return res.status(404).json({ message: "No athletes found for this team." });
        }

        const result = athletes.map(athlete => ({
            idAthlete: athlete.idAthlete,
            name: athlete.name,
            position: athlete.position ? athlete.position.name : "Sem posição",
            rating: athlete.rating,
        }));

        return res.json(result);
    } catch (err) {
        console.error("Error fetching athletes:", err);
        return res.status(500).json({ message: "Error fetching athletes." });
    }
};

// Get athlete by ID
const getAthleteById = async (req, res) => {
    const { id } = req.params;
    try {
        const athlete = await Athlete.findByPk(id, {
            include: [
                { model: Position, as: 'position' },
                { model: Guardian, as: 'guardian' },
                { model: Team, as: 'team' },
            ],
        });
        if (athlete) {
            res.json(athlete);
        } else {
            res.status(404).json({ message: 'Athlete not found!' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new athlete
const createAthlete = async (req, res) => {
    const { name, birthDate, nationality, birthplace, idPosition, idGuardian, idTeam, link, rating } = req.body;

    if (!name || !birthDate || !nationality || !birthplace) {
        return res.status(400).json({ message: 'Name, birth date, nationality and birthplace are required!' });
    }

    try {
        const existingAthlete = await Athlete.findOne({ where: { name } });
        if (existingAthlete && existingAthlete.idTeam) {
            return res.status(400).json({ message: 'This athlete already belongs to a team!' });
        }

        const newAthlete = await Athlete.create({
            name,
            birthDate,
            nationality,
            birthplace,
            idPosition: idPosition || null,
            idGuardian: idGuardian || null,
            idTeam: idTeam || null,
            link: link || null,
            rating: rating || 0,
        });

        res.status(201).json(newAthlete);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update athlete
const updateAthlete = async (req, res) => {
    try {
        const { idAthlete } = req.params;
        const athleteToUpdate = await Athlete.findByPk(idAthlete);
        if (!athleteToUpdate) {
            return res.status(404).json({ error: 'Athlete not found.' });
        }

        const fieldsToUpdate = {};
        if (req.body.name !== undefined) fieldsToUpdate.name = req.body.name;
        if (req.body.rating !== undefined) fieldsToUpdate.rating = req.body.rating;
        if (req.body.idPosition !== undefined) fieldsToUpdate.idPosition = req.body.idPosition;
        if (req.body.idTeam !== undefined) fieldsToUpdate.idTeam = req.body.idTeam;
        if (req.body.idGuardian !== undefined) fieldsToUpdate.idGuardian = req.body.idGuardian;
        if (req.body.link !== undefined) fieldsToUpdate.link = req.body.link;

        await athleteToUpdate.update(fieldsToUpdate);

        return res.json(athleteToUpdate);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// Delete athlete
const deleteAthlete = async (req, res) => {
    try {
        const { idAthlete } = req.params;

        const athleteToDelete = await Athlete.findByPk(idAthlete);
        if (!athleteToDelete) {
            return res.status(404).json({ error: 'Athlete not found.' });
        }

        await Task.update(
            { idAthlete: null },
            { where: { idAthlete } }
        );

        await athleteToDelete.destroy();

        return res.json({ message: 'Athlete deleted successfully.' });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

/*const getAthletesByFilter = async (req, res) => {
    const { name, position, team, rating } = req.query;

    try {
        const query = {
            where: {},
            include: [
                { model: Position, as: 'position' },
                { model: Guardian, as: 'guardian' },
                { model: Team, as: 'team' },
            ],
        };

        if (name) query.where.name = name;
        if (position) query.where.idPosition = position;
        if (team) query.where.idTeam = team;
        if (rating) query.where.rating = rating;

        const athletes = await Athlete.findAll(query);
        res.json(athletes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};*/

module.exports = {
    getAthletes,
    getAthleteById,
    createAthlete,
    updateAthlete,
    deleteAthlete,
    //getAthletesByFilter,
    getAthletesByTeam,
};
