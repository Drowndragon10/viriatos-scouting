import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserRoleFromToken } from '../components/jwtDecode';
import logo from '../images/logo.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const apiUrl = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, { email, password });
      const { authToken } = response.data;
      localStorage.setItem('authToken', authToken);
      const userRole = getUserRoleFromToken();
      if (userRole === 1) {
        navigate('/dashboard');
      } else if (userRole === 2) {
        navigate('/teams');
      } else if (userRole === 3) {
        navigate('/myTasks');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setErrorMessage('Conta bloqueada. Contacte o administrador.');
      } else {
        setErrorMessage('Email ou senha inválidos.');
      }
    }
  };

  return (
    <div className="container-fluid p-0 d-flex min-vh-100" style={{ position: 'relative' }}>
      {/* Painel Esquerdo */}
      <div
        className="col-lg-5 col-md-12 p-0 d-flex justify-content-center align-items-center"
        style={{
          backgroundColor: '#2C2C2C',
          zIndex: 1,
        }}
      >
        <div className="text-center d-flex align-items-center text-light">
          <img src={logo} alt="Logo" style={{ width: '150px', marginRight: '10px' }} />
          <h1 style={{ color: 'white' }}>
            Viriatos Scouting
          </h1>
        </div>
      </div>

      {/* Linha Amarela Vertical */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '41.66%', // 5/12 da tela (aprox. 41.66%) para alinhar com o painel esquerdo
          width: '2px',
          height: '100%',
          backgroundColor: 'yellow',
          zIndex: 5,
        }}
      ></div>

      {/* Painel Direito */}
      <div
        className="col-lg-7 col-md-12 d-flex justify-content-center align-items-center"
        style={{
          backgroundColor: '#121212',
          zIndex: 0,
        }}
      >
        <div className="login-form text-light p-4 w-100" style={{ maxWidth: '400px' }}>
          <h2 className="mb-4 text-center">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ backgroundColor: '#2C2C2C', border: 'none', color: 'white' }}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Palavra-Passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ backgroundColor: '#2C2C2C', border: 'none', color: 'white' }}
              />
            </div>
            <button type="submit" className="btn btn-warning w-100 mt-3" style={{ color: 'white' }}>
              Login
            </button>
            {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
