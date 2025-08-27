import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import DashboardAdmin from './pages/dashboard';
import ProtectedRoute from './components/protectedRoute';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={DashboardAdmin} allowedRoles={[1]} />}
        />      </Routes>
    </Router>
  );
}

export default App;
