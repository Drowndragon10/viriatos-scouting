const User = require('./user');
const UserType = require('./userType');
const Team = require('./team');
const TeamType = require('./teamType');
const AgeCategory = require('./ageCategory');
const Athlete = require('./athlete');
const Guardian = require('./guardian');
const Position = require('./position');
const Match = require('./match');
const TeamMatch = require('./teamMatch');
const Report = require('./report');
const Task = require('./task');

// ==========================
// User
// ==========================
User.belongsTo(UserType, { foreignKey: 'idUserType', as: 'userType' });
UserType.hasMany(User, { foreignKey: 'idUserType', as: 'users' });

// ==========================
// Team
// ==========================
Team.belongsTo(AgeCategory, { foreignKey: 'idAgeCategory', as: 'ageCategory' });
AgeCategory.hasMany(Team, { foreignKey: 'idAgeCategory', as: 'teams' });

Team.belongsTo(TeamType, { foreignKey: 'idTeamType', as: 'teamType' });
TeamType.hasMany(Team, { foreignKey: 'idTeamType', as: 'teams' });

Team.belongsTo(User, { foreignKey: 'idUser', as: 'user' });
User.hasMany(Team, { foreignKey: 'idUser', as: 'teams' });

// ==========================
// Athlete
// ==========================
Athlete.belongsTo(Guardian, { foreignKey: 'idGuardian', as: 'guardian' });
Guardian.hasMany(Athlete, { foreignKey: 'idGuardian', as: 'athletes' });

Athlete.belongsTo(Team, { foreignKey: 'idTeam', as: 'team' });
Team.hasMany(Athlete, { foreignKey: 'idTeam', as: 'athletes' });

Athlete.belongsTo(Position, { foreignKey: 'idPosition', as: 'position' });
Position.hasMany(Athlete, { foreignKey: 'idPosition', as: 'athletes' });

// ==========================
// TeamMatch
// ==========================
TeamMatch.belongsTo(Team, { foreignKey: 'idTeam', as: 'team' });
Team.hasMany(TeamMatch, { foreignKey: 'idTeam', as: 'teamMatches' });

TeamMatch.belongsTo(Match, { foreignKey: 'idMatch', as: 'match' });
Match.hasMany(TeamMatch, { foreignKey: 'idMatch', as: 'teamMatches' });

// ==========================
// Report
// ==========================
Report.belongsTo(Athlete, { foreignKey: 'idAthlete', as: 'athlete' });
Athlete.hasMany(Report, { foreignKey: 'idAthlete', as: 'reports' });

Report.belongsTo(User, { foreignKey: 'idUser', as: 'user' });
User.hasMany(Report, { foreignKey: 'idUser', as: 'reports' });

// ==========================
// Task
// ==========================
Task.belongsTo(Match, { foreignKey: 'idMatch', as: 'match' });
Match.hasMany(Task, { foreignKey: 'idMatch', as: 'tasks' });

Task.belongsTo(User, { foreignKey: 'idUser', as: 'user' });
User.hasMany(Task, { foreignKey: 'idUser', as: 'tasks' });

Task.belongsTo(Athlete, { foreignKey: 'idAthlete', as: 'athlete' });
Athlete.hasMany(Task, { foreignKey: 'idAthlete', as: 'tasks' });

module.exports = {
  User,
  UserType,
  Team,
  TeamType,
  AgeCategory,
  Athlete,
  Guardian,
  Position,
  Match,
  TeamMatch,
  Report,
  Task
};
