const Team = require('../models/team');
const AgeCategory = require('../models/ageCategory');
const TeamType = require('../models/teamType');
const User = require('../models/user');


const getTeams = async (req, res) => {
    try {
        const { page = 1, limit = 10, teamTypeId } = req.query;
        const where = {};

        if (teamTypeId) {
            where.idType = teamTypeId; // Filter by team type
        }

        const teams = await Team.findAll({
            where,
            include: [
                { model: AgeCategory, as: 'ageCategory' },
                { model: TeamType, as: 'teamType' },
                { model: User, as: 'user' },
            ],
            offset: (page - 1) * limit,
            limit: limit,
        });

        return res.json(teams);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// 📌 Get Team by ID
const getTeamById = async (req, res) => {
    try {
        const { idTeam } = req.params;
        const team = await Team.findByPk(idTeam, {
            include: [
                { model: AgeCategory, as: 'ageCategory' },
                { model: TeamType, as: 'teamType' },
                { model: User, as: 'user' },
            ],
        });

        if (!team) {
            return res.status(404).json({ message: 'Team not found.' });
        }

        return res.json(team);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// 📌 Create Team
const createTeam = async (req, res) => {
    const { name, county, district, idAgeCategory, idTeamType, idUser } = req.body;

    try {
        if (!name || !idAgeCategory || !idTeamType || !idUser) {
            return res.status(400).json({ message: 'All required fields must be filled.' });
        }

        // Validate associations
        const ageCategory = await AgeCategory.findByPk(idAgeCategory);
        const type = await TeamType.findByPk(idTeamType);
        const user = await User.findByPk(idUser);

        if (!ageCategory) return res.status(400).json({ message: 'Age Category not found.' });
        if (!type) return res.status(400).json({ message: 'Team Type not found.' });
        if (!user) return res.status(400).json({ message: 'Coach not found.' });

        // Ensure the coach does not already manage a team
        const existingTeam = await Team.findOne({ where: { idUser } });
        if (existingTeam) return res.status(400).json({ message: 'This coach is already assigned to a team.' });

        // Create new team
        const newTeam = await Team.create({
            name,
            county,
            district,
            idAgeCategory,
            idTeamType,
            idUser,
        });

        return res.status(201).json({ message: 'Team created successfully!', team: newTeam });
    } catch (error) {
        console.error('Error creating team:', error);
        return res.status(500).json({ message: 'Internal error creating team.' });
    }
};
// 📌 Update Team
const updateTeam = async (req, res) => {
    try {
        const { idTeam } = req.params;
        const team = await Team.findByPk(idTeam);

        if (!team) {
            return res.status(404).json({ message: 'Team not found.' });
        }

        await team.update(req.body);

        return res.json(team);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// 📌 Delete Team
const deleteTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const team = await Team.findByPk(teamId);

        if (!team) {
            return res.status(404).json({ message: 'Team not found.' });
        }

        await team.destroy();

        return res.json({ message: 'Team deleted successfully.' });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// 📌 Get Team by User ID
const getTeamsByCoach = async (req, res) => {
    try {
        // Debug do parâmetro recebido
        console.log('DEBUG req.params:', req.params);

        const { idUser } = req.params;
        console.log('DEBUG idUser:', idUser);

        // Debug do where usado no Sequelize
        const whereClause = { idUser: idUser };
        console.log('DEBUG whereClause:', whereClause);

        const teams = await Team.findAll({
            where: whereClause,
            include: [
                { model: AgeCategory, as: 'ageCategory' },
                { model: TeamType, as: 'teamType' },
                { model: User, as: 'user' },
            ],
        });

        // Debug do resultado do Sequelize
        console.log('DEBUG teams:', teams);

        if (teams.length === 0) {
            console.log('DEBUG: No team found for this user.');
            return res.status(404).json({ message: 'No team found for this user.' });
        }

        return res.json(teams);
    } catch (error) {
        console.log('DEBUG error:', error);
        return res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getTeams,
    getTeamById,
    getTeamsByCoach,
    createTeam,
    updateTeam,
    deleteTeam,
};
