import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/sidebar';

const EditarEquipa = () => {
  const { idTeam } = useParams(); // agora usa idTeam
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  const [team, setTeam] = useState({
    name: '',
    county: '',
    district: '',
    idAgeCategory: '',
    idTeamType: '',
    idUser: ''
  });

  const [ageCategories, setAgeCategories] = useState([]);
  const [teamTypes, setTeamTypes] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Buscar dados da equipa e opções
  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');

      const [ageCatRes, teamTypesRes, usersRes, teamRes] = await Promise.all([
        axios.get(`${apiUrl}/ageCategories`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${apiUrl}/teamTypes`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${apiUrl}/auth/users`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${apiUrl}/teams/${idTeam}`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setAgeCategories(ageCatRes.data);
      setTeamTypes(teamTypesRes.data);
      setUsers(usersRes.data.filter(u => u.idUserType === 2)); // só treinadores

      setTeam({
        name: teamRes.data.name,
        county: teamRes.data.county,
        district: teamRes.data.district,
        idAgeCategory: teamRes.data.idAgeCategory,
        idTeamType: teamRes.data.idTeamType,
        idUser: teamRes.data.idUser
      });
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Erro ao carregar dados.');
    }
  }, [idTeam, apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeam(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${apiUrl}/teams/${idTeam}`, team, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Equipa atualizada com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar equipa:', err);
      setError('Erro ao atualizar a equipa.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', backgroundColor: '#2C2C2C' }}>
      <Sidebar />
      <div style={{ display: 'flex', flexDirection: 'column', padding: '20px', flex: 1 }}>
        <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>Editar Equipa</h2>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
          {['name', 'county', 'district'].map(field => (
            <div key={field} style={{ marginBottom: '10px' }}>
              <input
                type="text"
                name={field}
                value={team[field] || ''}
                onChange={handleChange}
                placeholder={`Digite ${field}`}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#121212',
                  border: 'none',
                  color: 'white'
                }}
              />
            </div>
          ))}

          <div style={{ marginBottom: '10px' }}>
            <select
              name="idAgeCategory"
              value={team.idAgeCategory}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#121212',
                border: 'none',
                color: 'white'
              }}
            >
              <option value="">Selecione a Categoria Etária</option>
              {ageCategories.map(cat => (
                <option key={cat.idAgeCategory} value={cat.idAgeCategory}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <select
              name="idTeamType"
              value={team.idTeamType}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#121212',
                border: 'none',
                color: 'white'
              }}
            >
              <option value="">Selecione o Tipo de Equipa</option>
              {teamTypes.map(type => (
                <option key={type.idTeamType} value={type.idTeamType}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <select
              name="idUser"
              value={team.idUser}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#121212',
                border: 'none',
                color: 'white'
              }}
            >
              <option value="">Selecione um treinador</option>
              {users.map(u => (
                <option key={u.idUser} value={u.idUser}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'black',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {isLoading ? 'A atualizar...' : 'Atualizar Equipa'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditarEquipa;
