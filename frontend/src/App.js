import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import DashboardAdmin from './pages/dashboard';
import CreateTeam from './pages/createTeam';
import ProtectedRoute from './components/protectedRoute';
import AgeCategories from './pages/ageCategories';
import CreateAgeCategories from './pages/createAgeCategories';
import Positions from './pages/positions';
import CreatePositions from './pages/createPosition';
import Athletes from './pages/athletes';
import EditAthlete from './pages/editAthlete';
import CreateAthlete from './pages/createAthlete';
import CreateGuardian from './pages/createGuardian';
import Matches from './pages/matches';
import CreateMatch from './pages/createMatch';
import Reports from './pages/reports';
import Teams from './pages/teams';
import EditTeam from './pages/editTeam';
import Tasks from './pages/tasks';
import AssignTask from './pages/assignTask';
import Invite from './pages/invite';
import InviteRegister from './pages/inviteRegister';
import EditMatch from './pages/editMatch';
import MyTasks from './pages/myTasks.js'
import MyReports from './pages/myReports.js';
import CreateReport from './pages/createReport.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/invite" element={<ProtectedRoute element={Invite} allowedRoles={[1]} />} />
        <Route path="/invite/:token" element={<InviteRegister />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={DashboardAdmin} allowedRoles={[1]} />}
        />
        <Route
          path="/teams"
          element={<ProtectedRoute element={Teams} allowedRoles={[1, 2, 3]} />} />
        <Route
          path="/team/create"
          element={<ProtectedRoute element={CreateTeam} allowedRoles={[1]} />} />
          <Route
          path="/team/edit/:idTeam"
          element={<ProtectedRoute element={EditTeam} allowedRoles={[1]} />} />
        <Route
          path="/ageCategories"
          element={<ProtectedRoute element={AgeCategories} allowedRoles={[1]} />} />
        <Route
          path="/ageCategorie/create"
          element={<ProtectedRoute element={CreateAgeCategories} allowedRoles={[1]} />} />
        <Route
          path="/positions"
          element={<ProtectedRoute element={Positions} allowedRoles={[1]} />} />
        <Route
          path="/position/create"
          element={<ProtectedRoute element={CreatePositions} allowedRoles={[1]} />} />
        <Route
          path="/athletes"
          element={<ProtectedRoute element={Athletes} allowedRoles={[1, 2, 3]} />} />
          <Route
          path="/athlete/edit/:idAthlete"
          element={<ProtectedRoute element={EditAthlete} allowedRoles={[1]} />} />
        <Route
          path="/athlete/create"
          element={<ProtectedRoute element={CreateAthlete} allowedRoles={[1]} />} />
        <Route
          path="/guardian/create"
          element={<ProtectedRoute element={CreateGuardian} allowedRoles={[1]} />} />
        <Route
          path="/matches"
          element={<ProtectedRoute element={Matches} allowedRoles={[1, 2, 3]} />} />
        <Route
          path="/match/create"
          element={<ProtectedRoute element={CreateMatch} allowedRoles={[1]} />} />
          <Route
          path="/match/edit/:idMatch"
          element={<ProtectedRoute element={EditMatch} allowedRoles={[1]} />} />
        <Route
          path="/reports"
          element={<ProtectedRoute element={Reports} allowedRoles={[1, 3]} />} />
        <Route
          path="/tasks"
          element={<ProtectedRoute element={Tasks} allowedRoles={[1]} />} />
        <Route
          path="/task/assign"
          element={<ProtectedRoute element={AssignTask} allowedRoles={[1]} />} />
        <Route
          path="/myTasks"
          element={<ProtectedRoute element={MyTasks} allowedRoles={[3]} />} />
          <Route
          path="/myReports"
          element={<ProtectedRoute element={MyReports} allowedRoles={[3]} />} />
          <Route
          path="/report/:idAthlete"
          element={<ProtectedRoute element={CreateReport} allowedRoles={[3]} />} />
      </Routes>
    </Router>
  );
}

export default App;
