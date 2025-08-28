import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/sidebar';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTimes } from 'react-icons/fa';

const apiRequest = async (method, endpoint, data = null) => {
  const apiUrl = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem('authToken');
  const config = { headers: { Authorization: `Bearer ${token}` } };
  return method === 'get'
    ? axios.get(`${apiUrl}${endpoint}`, config)
    : axios({ method, url: `${apiUrl}${endpoint}`, data, ...config });
};

const AgeCategoriesPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await apiRequest('get', '/ageCategories');
        setCategorias(response.data);
      } catch (err) {
        setError('Erro ao carregar as categorias etárias.');
        console.error(err);
      }
    };
    fetchCategorias();
  }, []);

  const handleAdd = () => navigate('/ageCategorie/create');
  const handleEdit = (idAgeCategory) => navigate(`/editarcategoria/${idAgeCategory}`);
  const handleDelete = async (idAgeCategory) => {
    if (!window.confirm('Tem certeza que deseja excluir esta categoria?')) return;
    try {
      await apiRequest('delete', `/ageCategories/${idAgeCategory}`);
      setCategorias(categorias.filter(c => c.idAgeCategory !== idAgeCategory));
    } catch (err) {
      console.error('Erro ao apagar categoria:', err);
    }
  };

  const filteredCategorias = categorias.filter(categoria =>
    categoria.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) return <div className="text-center py-10 text-white">{error}</div>;

  return (
    <div style={{ display: 'flex', backgroundColor: '#2C2C2C', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div className="mt-5" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="mb-5 text-white">Categorias Etárias</h2>

          <div className="d-flex justify-content-between mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por nome"
              className="form-control"
              style={{ backgroundColor: '#121212', width: '300px', border: 'none', color: 'white' }}
            />
            <button
              onClick={handleAdd}
              className="btn"
              style={{ backgroundColor: '#121212', color: '#ffffff', borderRadius: '10px', padding: '7px 20px' }}
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
                    <td colSpan="2" className="text-center text-white" style={{ backgroundColor: '#121212' }}>
                      Nenhuma categoria encontrada.
                    </td>
                  </tr>
                ) : (
                  filteredCategorias.map(categoria => (
                    <tr key={categoria.idAgeCategory} style={{ backgroundColor: '#121212', color: '#fff' }}>
                      <td>{categoria.name}</td>
                      <td>
                        <FaEdit
                          className="text-primary"
                          style={{ cursor: 'pointer', marginRight: '1rem' }}
                          onClick={() => handleEdit(categoria.idAgeCategory)}
                        />
                        <FaTimes
                          className="text-danger"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleDelete(categoria.idAgeCategory)}
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
