const Report = require('../models/report'); 
const Athlete = require('../models/athlete');
const User = require('../models/user');

const getReports = async (req, res) => {
    try {
        const reports = await Report.findAll({
            include: [
                { model: Athlete, as: 'athlete' },
                { model: User, as: 'user' },
            ],
        });
        return res.json(reports);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const getReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await Report.findByPk(id, {
            include: [
                { model: Athlete, as: 'athlete' },
                { model: User, as: 'user' },
            ],
        });
        return res.json(report);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const createReport = async (req, res) => {
    try {
        const { idUser, ...restData } = req.body;

        if (!idUser) {
            return res.status(400).json({ error: 'User ID is required.' });
        }

        const { idAthlete } = req.params;

        // Check if athlete exists
        const athleteFound = await Athlete.findByPk(idAthlete);
        if (!athleteFound) {
            return res.status(404).json({ error: 'Athlete not found.' });
        }

        // Check if user exists
        const userFound = await User.findByPk(idUser);
        if (!userFound) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Check if report already exists for this athlete
        const existingReport = await Report.findOne({
            where: { idAthlete },
        });

        if (existingReport) {
            return res.status(400).json({ error: 'A report already exists for this athlete.' });
        }

        const reportData = {
            ...restData,
            idAthlete,
            idUser,
        };

        const createdReport = await Report.create(reportData);

        return res.status(201).json(createdReport);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const getReportsByUserId = async (req, res) => {
    const { idUser } = req.params;

    try {
        const reports = await Report.findAll({
            where: {
                '$user.idUser$': idUser  
            },
            include: [
                { model: Athlete, as: 'athlete' },
                { model: User, as: 'user' }
            ]
        });

        if (reports.length === 0) {
            return res.status(404).json({ message: "No reports found for this user." });
        }

        return res.status(200).json(reports);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching reports.", error: error.message });
    }
};

const approveReport = async (req, res) => {
    const { idReport } = req.params;

    try {
        const reportFound = await Report.findByPk(idReport);
        if (!reportFound) {
            return res.status(404).json({ error: 'Report not found.' });
        }

        const updatedReport = await reportFound.update({ status: 'Approved' });

        return res.status(200).json({ report: updatedReport });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const rejectReport = async (req, res) => {
    const { idReport } = req.params;

    try {
        const reportFound = await Report.findByPk(idReport);
        if (!reportFound) {
            return res.status(404).json({ error: 'Report not found.' });
        }

        const updatedReport = await reportFound.update({ status: 'Rejected' });

        return res.status(200).json({ report: updatedReport });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const getReportByAthleteId = async (req, res) => {
    try {
        const { idAthlete } = req.params;

        const existingReport = await Report.findOne({
            where: { idAthlete },
        });

        if (existingReport) {
            return res.status(200).json({ message: 'Report already exists for this athlete.' });
        }

        return res.status(404).json({ message: 'No report found for this athlete.' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getReports,
    getReportById,
    createReport,
    approveReport,
    rejectReport,
    getReportsByUserId,
    getReportByAthleteId
};
