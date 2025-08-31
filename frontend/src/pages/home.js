import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="container-fluid d-flex flex-column justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        backgroundColor: '#121212',
        color: 'white',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      {/* Logo e Título */}
      <div className="mb-4 d-flex align-items-center justify-content-center">
        <img src={logo} alt="Logo" style={{ width: '100px', marginRight: '15px' }} />
        <h1 style={{ fontSize: '2.5rem' }}>Viriatos Scouting</h1>
      </div>

      {/* Texto de Boas-Vindas */}
      <p style={{ fontSize: '1.2rem', marginBottom: '40px' }}>
        Bem-vindo à plataforma Viriatos Scouting! Explore as funcionalidades e organize suas tarefas.
      </p>

      {/* Botões de Navegação */}
      <div className="d-flex gap-3">
        <button
          className="btn btn-warning"
          style={{ color: 'white', minWidth: '120px' }}
          onClick={() => navigate('/login')}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default HomePage;
