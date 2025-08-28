import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import DashboardAdmin from './pages/dashboard';
import CreateTeam from './pages/createTeam';
import ProtectedRoute from './components/protectedRoute';

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
        </Routes>
    </Router>
  );
}

export default App;
