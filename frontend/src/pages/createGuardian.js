import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/sidebar';
import { useNavigate } from 'react-router-dom';

const CreateGuardian = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const apiUrl = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        `${apiUrl}/guardians`,
        { name, contact, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // limpar campos
      setName('');
      setContact('');
      setEmail('');

      // voltar para a criação de atleta
      navigate('/athlete/create');

    } catch (error) {
      console.error("Erro ao criar encarregado:", error);
    }
  };

  return (
    <div className="d-flex" style={{ backgroundColor: "#121212", minHeight: "100vh" }}>
      <Sidebar />

      <div className="container mt-4" style={{ maxWidth: '600px', padding: '20px' }}>
        <h2 className="text-white mb-4">Adicionar Encarregado</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Nome do Encarregado"
              className="form-control"
              style={{ backgroundColor: '#2C2C2C', border: 'none', color: 'white' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              id="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
              placeholder="Contacto do Encarregado"
              className="form-control"
              style={{ backgroundColor: '#2C2C2C', border: 'none', color: 'white' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email do Encarregado"
              className="form-control"
              style={{ backgroundColor: '#2C2C2C', border: 'none', color: 'white' }}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{
              backgroundColor: '#000',
              color: 'white',
              padding: '10px 15px',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '5px',
              width: '100%',
            }}
          >
            Adicionar Encarregado
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGuardian;
