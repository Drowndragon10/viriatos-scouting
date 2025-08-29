import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/sidebar';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTimes, FaCheck } from 'react-icons/fa';

const AgeCategoriesPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState('');
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${apiUrl}/ageCategories`, config);
        setCategorias(response.data);
      } catch (err) {
        setError('Erro ao carregar as categorias etárias.');
        console.error(err);
      }
    };
    fetchCategorias();
  }, [apiUrl]);

  const handleAdd = () => navigate('/ageCategorie/create');

  const handleDelete = async (idCategory) => {
    if (!window.confirm('Tem certeza que deseja excluir esta categoria?')) return;
    try {
      const token = localStorage.getItem('authToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${apiUrl}/ageCategories/${idCategory}`, config);
      setCategorias(categorias.filter(c => c.idCategory !== idCategory));
    } catch (err) {
      console.error('Erro ao apagar categoria:', err);
    }
  };

  const handleEdit = (categoria) => {
    setEditingId(categoria.idCategory);
    setNewName(categoria.name);
  };

  const saveEdit = async (idCategory) => {
    try {
      const token = localStorage.getItem('authToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${apiUrl}/ageCategories/${idCategory}`, { name: newName }, config);
      setCategorias(categorias.map(c => c.idCategory === idCategory ? { ...c, name: newName } : c));
      setEditingId(null);
    } catch (err) {
      console.error('Erro ao atualizar categoria:', err);
    }
  };

  const filteredCategorias = categorias.filter(categoria =>
    categoria.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) return <div className="text-center py-10 text-white">{error}</div>;

  return (
    <div style={{ display: 'flex', backgroundColor: '#121212', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div className="mt-5" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="mb-2 text-white">Categorias Etárias</h2>
          <hr />
          <div className="d-flex justify-content-between mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por nome"
              className="form-control"
              style={{ backgroundColor: '#2C2C2C', width: '300px', border: 'none', color: 'white' }}
            />
            <button
              onClick={handleAdd}
              className="btn"
              style={{ backgroundColor: '#2C2C2C', color: '#ffffff', borderRadius: '10px', padding: '7px 20px' }}
            >
              + Criar Categoria Etária
            </button>
          </div>

          <div className="table-responsive">
            <table className="table-custom">
              <thead>
                <tr style={{ backgroundColor: '#FDD522', color: '#000' }}>
                  <th>Nome</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategorias.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="text-center text-white" style={{ backgroundColor: '#2C2C2C' }}>
                      Nenhuma categoria encontrada.
                    </td>
                  </tr>
                ) : (
                  filteredCategorias.map(categoria => (
                    <tr key={categoria.idCategory} style={{ backgroundColor: '#2C2C2C', color: '#fff' }}>
                      <td>
                        {editingId === categoria.idCategory ? (
                          <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="form-control"
                          />
                        ) : (
                          categoria.name
                        )}
                      </td>
                      <td>
                        {editingId === categoria.idCategory ? (
                          <>
                            <FaCheck
                              className="text-success"
                              style={{ cursor: 'pointer', marginRight: '1rem' }}
                              onClick={() => saveEdit(categoria.idCategory)}
                            />
                            <FaTimes
                              className="text-warning"
                              style={{ cursor: 'pointer', marginRight: '1rem' }}
                              onClick={() => setEditingId(null)}
                            />
                          </>
                        ) : (
                          <FaEdit
                            style={{ cursor: 'pointer', marginRight: '1rem' }}
                            onClick={() => handleEdit(categoria)}
                          />
                        )}
                        <FaTimes
                          className="text-danger"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleDelete(categoria.idCategory)}
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

export default AgeCategoriesPage;
