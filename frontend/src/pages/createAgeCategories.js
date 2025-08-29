import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from "../components/sidebar";

const AdicionarCategoriaEtaria = () => {
  const [name, setName] = useState('');
  const [mensagem, setMensagem] = useState('');
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem(''); // limpar mensagem anterior

    if (!name.trim()) {
      setMensagem('O nome da categoria é obrigatório.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        `${apiUrl}/ageCategories`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setName('');
      setMensagem('Categoria adicionada com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      setMensagem(
        error.response?.data?.message || 'Erro ao criar categoria etária.'
      );
    }
  };

  return (
    <div className="d-flex" style={{ backgroundColor: "#121212", minHeight: "100vh" }}>
      <Sidebar />

      <div className="container mt-5" style={{ maxWidth: '600px', padding: '20px' }}>
        <h2 className="text-white mb-5">Adicionar Categoria Etária</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Nome da Categoria"
              className="form-control"
              style={{ backgroundColor: '#2C2C2C', border: 'none', color: 'white'}}
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
          >
            Adicionar
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

export default AdicionarCategoriaEtaria;
