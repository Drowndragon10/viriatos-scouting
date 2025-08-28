import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/sidebar';

const CreatePosition = () => {
  const [name, setName] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  const handleAddPosition = async (e) => {
    e.preventDefault();
    setMensagem('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('authToken');

      await axios.post(
        `${apiUrl}/positions`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setName('');
      setMensagem('Posição criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar posição:', error);
      setMensagem('Erro ao criar a posição. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex" style={{ backgroundColor: "#2C2C2C", minHeight: "100vh" }}>
      <Sidebar />
      <div className="container mt-4" style={{ maxWidth: '600px', padding: '20px' }}>
        <h2 className="text-white mb-4">Adicionar Posição</h2>
        <form onSubmit={handleAddPosition}>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Nome da Posição"
              className="form-control"
              style={{ backgroundColor: '#121212', opacity:'0.4', border: 'none', color: 'white' }}
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#000',
              color: 'white',
              padding: '10px 15px',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '5px',
              width: '100%',
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Carregando...' : 'Adicionar'}
          </button>
        </form>

        {mensagem && (
          <p style={{ marginTop: '20px', color: '#fff' }}>
            {mensagem}
          </p>
        )}
      </div>
    </div>
  );
};

export default CreatePosition;
