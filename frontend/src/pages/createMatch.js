import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/sidebar';

const CreateMatch = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [matchData, setMatchData] = useState({
    matchDate: '',  
    county: '',
    district: '',
    homeTeam: '',
    awayTeam: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`${apiUrl}/teams`, config);
        setTeams(data);
        setFilteredTeams(data);
      } catch (err) {
        console.error('Erro ao carregar as equipas:', err);
        setError('Erro ao carregar as equipas disponíveis.');
      }
    };
    fetchTeams();
  }, [apiUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMatchData((prev) => ({ ...prev, [name]: value }));

    if (name === 'homeTeam') {
      const selected = teams.find((t) => t.idTeam === Number(value));
      if (selected) {
        // Ajusta esta linha se o teu Team tiver outro campo de categoria (ex: idAgeCategory)
        setFilteredTeams(
          teams.filter(
            (t) =>
              t.idAgeCategory === selected.idAgeCategory && // <- use o campo real do teu modelo
              t.idTeam !== Number(value)
          )
        );
      } else {
        setFilteredTeams(teams);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const { homeTeam, awayTeam, matchDate, county, district } = matchData;

    if (homeTeam === awayTeam) {
      setError('A equipa da casa e a visitante não podem ser a mesma.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Payload no formato esperado pelo controller (matchDate + teams[])
      const payload = {
        matchDate,     // <- nome correto
        county,
        district,
        teams: [
          { idTeam: Number(homeTeam), role: 'casa' },
          { idTeam: Number(awayTeam), role: 'visitante' },
        ],
      };

      await axios.post(`${apiUrl}/matches`, payload, config);

      setMessage('Jogo criado com sucesso!');
      setMatchData({
        matchDate: '',
        county: '',
        district: '',
        homeTeam: '',
        awayTeam: '',
      });
    } catch (err) {
      console.error('Erro ao criar o jogo:', err);
      const apiMsg = err?.response?.data?.message;
      setError(apiMsg || 'Erro ao criar o jogo. Por favor, tente novamente.');
    }
  };

  return (
    <div style={{ display: 'flex', backgroundColor: '#2C2C2C' }}>
      <Sidebar />
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', padding: '20px', flex: 1 }}>
        <div className="card mt-5" style={{ width: '100%', maxWidth: '600px', backgroundColor: '#2C2C2C', border: 'none' }}>
          <h2 className="card-title text-center mb-5" style={{ color: 'white' }}>Adicionar Jogo</h2>

          {message && <p style={{ color: 'lightgreen' }}>{message}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="datetime-local"
                name="matchDate"                 // <- atualizado
                value={matchData.matchDate}     // <- atualizado
                onChange={handleChange}
                className="form-control"
                required
                style={{ backgroundColor: '#121212', opacity: '0.4', border: 'none', color: 'white' }}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="county"
                value={matchData.county}
                onChange={handleChange}
                className="form-control"
                placeholder="Concelho"
                required
                style={{ backgroundColor: '#121212', opacity: '0.4', border: 'none', color: 'white' }}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="district"
                value={matchData.district}
                onChange={handleChange}
                className="form-control"
                placeholder="Distrito"
                required
                style={{ backgroundColor: '#121212', opacity: '0.4', border: 'none', color: 'white' }}
              />
            </div>
            <div className="mb-3">
              <select
                name="homeTeam"
                value={matchData.homeTeam}
                onChange={handleChange}
                className="form-select"
                style={{ backgroundColor: '#121212', opacity: '0.4', border: 'none', color: 'white' }}
                required
              >
                <option value="" disabled>Selecione a Equipa da Casa</option>
                {teams.map((team) => (
                  <option key={team.idTeam} value={team.idTeam}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <select
                name="awayTeam"
                value={matchData.awayTeam}
                onChange={handleChange}
                className="form-select"
                style={{ backgroundColor: '#121212', opacity: '0.4', border: 'none', color: 'white' }}
                required
              >
                <option value="" disabled>Selecione a Equipa Visitante</option>
                {filteredTeams.map((team) => (
                  <option key={team.idTeam} value={team.idTeam}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="btn w-100"
              style={{ backgroundColor: '#000', color: '#fff', fontSize: '0.9rem' }}
            >
              Criar Jogo
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMatch;
