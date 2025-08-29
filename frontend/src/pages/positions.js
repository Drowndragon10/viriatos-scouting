import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTimes, FaCheck } from "react-icons/fa";

const PositionsPage = () => {
  const [positions, setPositions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState('');
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

  const handleEdit = (pos) => {
    setEditingId(pos.idPosition);
    setNewName(pos.name);
  };

  const saveEdit = async (idPosition) => {
    try {
      const token = localStorage.getItem('authToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${apiUrl}/positions/${idPosition}`, { name: newName }, config);
      setPositions(positions.map(p => p.idPosition === idPosition ? { ...p, name: newName } : p));
      setEditingId(null);
      setMensagem('Posição atualizada com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar posição:', err);
      setMensagem('Erro ao atualizar posição.');
    }
  };

  const filteredPositions = positions.filter(posicao =>
    posicao.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) return <div className="text-center py-10">{error}</div>;

  return (
    <div style={{ display: "flex", backgroundColor: "#121212", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <div className="mt-5" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 className="mb-2 text-white">Posições</h2>
<hr/>
          <div className="d-flex justify-content-between mb-3">
            <input
              type="text"
              placeholder="Pesquisar por nome"
              className="form-control"
              style={{ backgroundColor: '#2C2C2C', width: '300px', border: 'none', color: 'white' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={handleAdd}
              className="btn"
              style={{ backgroundColor: "#2C2C2C", color: "#ffffff", borderRadius: "10px", padding: "7px 20px" }}
            >
              + Criar Posição
            </button>
          </div>

          {mensagem && <p className="text-white mb-3">{mensagem}</p>}

          <div className="table-responsive">
            <table className="table-custom">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPositions.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="text-center text-white">
                      Nenhuma posição encontrada.
                    </td>
                  </tr>
                ) : (
                  filteredPositions.map(posicao => (
                    <tr key={posicao.idPosition}>
                      <td>
                        {editingId === posicao.idPosition ? (
                          <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="form-control"
                          />
                        ) : (
                          posicao.name
                        )}
                      </td>
                      <td>
                        {editingId === posicao.idPosition ? (
                          <>
                            <FaCheck
                              className="text-success"
                              style={{ cursor: "pointer", marginRight: "1rem" }}
                              onClick={() => saveEdit(posicao.idPosition)}
                            />
                            <FaTimes
                              className="text-warning"
                              style={{ cursor: "pointer", marginRight: "1rem" }}
                              onClick={() => setEditingId(null)}
                            />
                          </>
                        ) : (
                          <FaEdit
                            style={{ cursor: "pointer", marginRight: "1rem" }}
                            onClick={() => handleEdit(posicao)}
                          />
                        )}
                        <FaTimes
                          className="text-danger"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDelete(posicao.idPosition)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionsPage;
