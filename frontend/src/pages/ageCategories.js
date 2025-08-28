import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/sidebar';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';

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

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleEdit = (idAgeCategory) => navigate(`/editarcategoria/${idAgeCategory}`);

  const handleDelete = async (idAgeCategory) => {
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
    <div style={{ display: "flex", backgroundColor: "#2C2C2C", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <div className="mt-5" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 className="mb-5 text-white">Categorias Etárias</h2>
          <div className="d-flex justify-content-between mb-5">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
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
          <div className="row">
            {filteredCategorias.length === 0 ? (
              <p className="text-center text-white">Nenhuma categoria encontrada.</p>
            ) : (
              filteredCategorias.map(categoria => (
                <div key={categoria.idAgeCategory} className="col-md-3 mb-4">
                  <Card
                    nome={categoria.name}
                    onEdit={() => handleEdit(categoria.idAgeCategory)}
                    onDelete={() => handleDelete(categoria.idAgeCategory)}
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

export default AgeCategoriesPage;
