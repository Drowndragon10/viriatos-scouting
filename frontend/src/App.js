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
import CreateAthlete from './pages/createAthlete';

import Teams from './pages/teams';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
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
          path="/athlete/create"
          element={<ProtectedRoute element={CreateAthlete} allowedRoles={[1]} />} />
      </Routes>
    </Router>
  );
}

export default App;
