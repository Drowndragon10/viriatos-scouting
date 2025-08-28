import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "../components/sidebar";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";

const PositionsPage = () => {
  const [positions, setPositions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${apiUrl}/positions/`, config);
        setPositions(response.data);
      } catch (err) {
        setError('Erro ao carregar as posições.');
      }
    };

    fetchPositions();
  }, [apiUrl]);

  const handleAdd = () => navigate("/position/create");
  //const handleEdit = (idPosition) => navigate(`/editarposicao/${idPosition}`);

  const handleDelete = async (idPosition) => {
    if (!window.confirm("Tem certeza que deseja excluir esta posição?")) {
      setMensagem('A exclusão foi cancelada.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${apiUrl}/positions/${idPosition}`, config);
      setPositions(positions.filter(posicao => posicao.idPosition !== idPosition));
      setMensagem('Posição eliminada com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir posição:', err);
      setMensagem('Erro ao excluir a posição.');
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const filteredPositions = positions.filter(posicao =>
    posicao.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) return <div className="text-center py-10">{error}</div>;

  return (
    <div style={{ display: "flex", backgroundColor: "#2C2C2C", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <div className="mt-5" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 className="mb-5 text-white">Posições</h2>

          <div className="d-flex justify-content-between mb-3">
            <input
              type="text"
              placeholder="Pesquisar por nome"
              className="form-control"
              style={{ backgroundColor: '#121212', width: '300px', border: 'none', color: 'white' }}
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              onClick={handleAdd}
              className="btn"
              style={{ backgroundColor: "#121212", color: "#ffffff", borderRadius: "10px", padding: "7px 20px" }}
            >
              + Criar Posição
            </button>
          </div>

          {mensagem && <p className="text-white mb-3">{mensagem}</p>}

          <div className="row">
            {filteredPositions.length === 0 ? (
              <p className="text-white">Nenhuma posição encontrada.</p>
            ) : (
              filteredPositions.map(posicao => (
                <div key={posicao.idPosition} className="col-md-3 mb-4">
                  <Card
                    nome={posicao.name}
                    //onEdit={() => handleEdit(posicao.idPosition)}
                    onDelete={() => handleDelete(posicao.idPosition)}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionsPage;
