const express = require('express');
const cors = require('cors');
const sequelize = require('./models/database');
require('./models/associations');

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ageCategoryRoutes = require('./routes/ageCategoryRoutes');
const teamTypeRoutes = require('./routes/teamTypeRoutes');
const userTypeRoutes = require('./routes/userTypeRoutes');
const teamRoutes = require('./routes/teamRoutes');
const guardianRoutes = require('./routes/guardianRoutes');
const athletePositionRoutes = require('./routes/athletePositionRoutes');
const athleteRoutes = require('./routes/athleteRoutes');
const matchRoutes = require('./routes/matchRoutes');
const taskRoutes = require('./routes/taskRoutes');
const reportRoutes = require('./routes/reportRoutes');
const { verifyToken } = require('./authMiddleware');

const app = express();

app.use(
  cors({
    origin: 'https://pi4-wheat.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());

const port = process.env.PORT || 3000;

// Public routes
app.use('/auth', authRoutes);

// Protected routes
app.use('/admin', verifyToken, adminRoutes);
app.use('/ageCategories', verifyToken, ageCategoryRoutes);
app.use('/teamTypes', verifyToken, teamTypeRoutes);
app.use('/userTypes', verifyToken, userTypeRoutes);
app.use('/teams', verifyToken, teamRoutes);
app.use('/guardians', verifyToken, guardianRoutes);
app.use('/positions', verifyToken, athletePositionRoutes);
app.use('/athletes', verifyToken, athleteRoutes);
app.use('/matches', verifyToken, matchRoutes);
app.use('/tasks', verifyToken, taskRoutes);
app.use('/reports', verifyToken, reportRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).send({ message: 'Route not found!' });
});

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Tables synced successfully!');
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error syncing tables:', err);
  });
