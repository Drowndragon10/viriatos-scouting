const TeamMatch = require('../models/teamMatch');
const Team = require('../models/team');
const Match = require('../models/match');
const Task = require('../models/task');
const AgeCategory = require('../models/ageCategory');

// Create a match with two teams
const createMatchTeams = async (req, res) => {
  try {
    const { matchDate, county, district, teams } = req.body;

    if (!matchDate || !teams || !Array.isArray(teams) || teams.length !== 2) {
      return res.status(400).json({
        message: 'You must provide the match date and exactly two teams (casa and visitante).',
      });
    }

    for (const team of teams) {
      if (!team.idTeam || !team.role || !['casa', 'visitante'].includes(team.role)) {
        return res.status(400).json({
          message: 'Each team must have idTeam and a valid role (casa or visitante).',
        });
      }

      const existingTeam = await Team.findByPk(team.idTeam);
      if (!existingTeam) {
        return res.status(404).json({ message: `Team with ID ${team.idTeam} not found.` });
      }
    }

    const match = await Match.create({
      matchDate,
      county,
      district,
    });

    const records = [];
    for (const team of teams) {
      const teamMatch = await TeamMatch.create({
        idTeam: team.idTeam,
        idMatch: match.idMatch,
        role: team.role,
      });
      records.push(teamMatch);
    }

    res.status(201).json({
      message: 'Match and teams successfully created and associated.',
      match,
      records,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating match and associating teams.' });
  }
};

// List all matches with teams
const listMatches = async (req, res) => {
  try {
    const matches = await Match.findAll();

    const matchesWithTeams = await Promise.all(
      matches.map(async (match) => {
        const teams = await TeamMatch.findAll({
          where: { idMatch: match.idMatch },
          include: [{ model: Team, as: 'team' }],
        });
        return { match, teams };
      })
    );

    res.status(200).json(matchesWithTeams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error listing matches and teams.' });
  }
};

// Get a specific match
const listMatch = async (req, res) => {
  try {
    const { idMatch } = req.params;
    const match = await Match.findByPk(idMatch);
    if (!match) {
      return res.status(404).json({ message: 'Match not found.' });
    }

    const teams = await TeamMatch.findAll({
      where: { idMatch },
      include: [{ model: Team, as: 'team' }],
    });

    res.status(200).json({ match, teams });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error listing the match.' });
  }
};

// Update a match
const updateMatch = async (req, res) => {
  try {
    const { idMatch } = req.params;
    const { county, district, matchDate, teams } = req.body;

    const match = await Match.findByPk(idMatch);
    if (!match) {
      return res.status(404).json({ message: 'Match not found.' });
    }

    await match.update({ county, district, matchDate });

    if (teams && Array.isArray(teams)) {
      if (teams.length !== 2) {
        return res.status(400).json({
          message: 'You must provide exactly two teams (casa and visitante).',
        });
      }

      const roles = teams.map((t) => t.role);
      if (new Set(roles).size !== 2) {
        return res.status(400).json({ message: 'Roles must be "casa" and "visitante".' });
      }

      for (const team of teams) {
        if (!team.idTeam || !['casa', 'visitante'].includes(team.role)) {
          return res.status(400).json({
            message: 'Each team must have idTeam and a valid role (casa or visitante).',
          });
        }

        const existingTeam = await Team.findByPk(team.idTeam);
        if (!existingTeam) {
          return res.status(404).json({ message: `Team with ID ${team.idTeam} not found.` });
        }

        const existingTeamMatch = await TeamMatch.findOne({
          where: { idMatch, role: team.role },
        });

        if (existingTeamMatch) {
          await existingTeamMatch.update({ idTeam: team.idTeam });
        } else {
          await TeamMatch.create({
            idTeam: team.idTeam,
            idMatch,
            role: team.role,
          });
        }
      }
    }

    res.status(200).json({ message: 'Match and teams successfully updated.' });
  } catch (error) {
    console.error('Error updating match:', error);
    res.status(500).json({ message: 'Error updating match and associated teams.' });
  }
};

// Delete a match (keep tasks intact)
const deleteMatch = async (req, res) => {
  try {
    const { idMatch } = req.params;

    const match = await Match.findByPk(idMatch);
    if (!match) {
      return res.status(404).json({ message: 'Match not found.' });
    }

    await Task.update({ idMatch: null }, { where: { idMatch } });
    await TeamMatch.destroy({ where: { idMatch } });
    await match.destroy();

    res.status(200).json({ message: 'Match and teams removed successfully, tasks kept intact.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting match and associated teams.' });
  }
};

// List matches by age category
const listMatchesByCategory = async (req, res) => {
  try {
    const { idAgeCategory } = req.params;

    const teamMatches = await TeamMatch.findAll({
      include: [
        {
          model: Team,
          as: 'team',
          where: { idAgeCategory },
          attributes: ['name', 'county', 'district'],
        },
        {
          model: Match,
          as: 'match',
          attributes: ['idMatch', 'matchDate', 'county', 'district'],
        },
      ],
    });

    if (teamMatches.length === 0) {
      return res.status(404).json({ message: 'No matches found for the specified category.' });
    }

    const formattedMatches = teamMatches.reduce((acc, teamMatch) => {
      const { match, team, role } = teamMatch;
      const existingMatch = acc.find((m) => m.idMatch === match.idMatch);

      if (existingMatch) {
        existingMatch.teams.push({
          teamName: team.name,
          role,
          county: team.county,
          district: team.district,
        });
      } else {
        acc.push({
          idMatch: match.idMatch,
          matchDate: match.matchDate,
          county: match.county,
          district: match.district,
          teams: [
            {
              teamName: team.name,
              role,
              county: team.county,
              district: team.district,
            },
          ],
        });
      }

      return acc;
    }, []);

    res.status(200).json(formattedMatches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error listing matches by category.' });
  }
};

module.exports = {
  createMatchTeams,
  listMatches,
  listMatch,
  updateMatch,
  deleteMatch,
  listMatchesByCategory,
};
