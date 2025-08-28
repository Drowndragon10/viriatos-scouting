import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "../components/sidebar";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
import { getUserRoleFromToken } from "../components/jwtDecode";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AthletesPage = () => {
  const [athletes, setAthletes] = useState([]);
  const [allAthletes, setAllAthletes] = useState([]);
  const [positions, setPositions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterPosition, setFilterPosition] = useState('');
  const [filterBirthYear, setFilterBirthYear] = useState('');
  const [filterRating, setFilterRating] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const userRole = getUserRoleFromToken();
    setIsAdmin(userRole === 1);

    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        const [athletesRes, positionsRes, teamsRes] = await Promise.all([
          axios.get(`${apiUrl}/athletes`, config),
          axios.get(`${apiUrl}/positions`, config),
          axios.get(`${apiUrl}/teams`, config)
        ]);

        setAthletes(athletesRes.data);
        setAllAthletes(athletesRes.data);
        setPositions(positionsRes.data);
        setTeams(teamsRes.data);
      } catch (err) {
        setError('Erro ao carregar os dados.');
      }
    };

    fetchData();
  }, [apiUrl]);

  const handleAdd = () => navigate("/create-athlete");
  const handleEdit = (idAthlete) => navigate(`/edit-athlete/${idAthlete}`);

  const handleDelete = async (idAthlete) => {
    if (!window.confirm("Tem certeza que deseja excluir este atleta?")) {
      setMessage('A exclusão foi cancelada.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${apiUrl}/athletes/${idAthlete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAthletes(athletes.filter(a => a.idAthlete !== idAthlete));
      setMessage('Atleta excluído com sucesso.');
    } catch (err) {
      setMessage('Erro ao excluir o atleta.');
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const toggleFilters = () => setFiltersOpen(!filtersOpen);

  const handleFilterChange = () => {
    let filtered = allAthletes;

    if (filterPosition) filtered = filtered.filter(a => a.position?.name === filterPosition);
    if (filterBirthYear) filtered = filtered.filter(a => new Date(a.birthDate).getFullYear() === filterBirthYear);
    if (filterRating) filtered = filtered.filter(a => a.rating === parseFloat(filterRating));
    if (filterTeam) filtered = filtered.filter(a => a.team?.name === filterTeam);

    setAthletes(filtered);
  };

  const handleClearFilters = () => {
    setFilterPosition('');
    setFilterBirthYear('');
    setFilterRating('');
    setFilterTeam('');
    setAthletes(allAthletes);
  };

  const filteredAthletes = athletes.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) return <div className="text-center py-10">{error}</div>;

  return (
    <div style={{ display: "flex", backgroundColor: "#2C2C2C", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <div className="mt-5" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 className="mb-5 text-white">Atletas</h2>
          {message && <p className="text-white mb-3">{message}</p>}

          <div className="d-flex justify-content-between mb-4">
            <div className="d-flex gap-3">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Pesquisar por nome"
                className="form-control"
                style={{ backgroundColor: '#121212', width: '300px', border: 'none', color: 'white' }}
              />
              <button onClick={toggleFilters} className="btn text-white" style={{ backgroundColor: '#121212', border: 'none' }}>
                Filtros ▾
              </button>
            </div>
            {isAdmin && (
              <button onClick={handleAdd} className="btn" style={{ backgroundColor: "#121212", color: "#ffffff", borderRadius: "10px", padding: "7px 20px" }}>
                + Criar Atleta
              </button>
            )}
          </div>

          {filtersOpen && (
            <div className="mb-4 p-3 d-flex align-items-center justify-content-between" style={{ backgroundColor: '#1F1F1F', borderRadius: '10px' }}>
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <label className="text-white mb-1">Posição</label>
                  <select
                    value={filterPosition}
                    onChange={(e) => setFilterPosition(e.target.value)}
                    className="form-select"
                    style={{ backgroundColor: '#121212', color: 'white', border: 'none', width: '180px' }}
                  >
                    <option value="">Todas as Posições</option>
                    {positions.map(p => <option key={p.idPosition} value={p.name}>{p.name}</option>)}
                  </select>
                </div>

                <div className="me-3">
                  <label className="text-white mb-1">Rating (0 a 5)</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="form-control"
                    style={{ backgroundColor: '#121212', color: 'white', border: 'none', width: '150px' }}
                  />
                </div>

                <div className="me-3">
                  <label className="text-white mb-1">Clube</label>
                  <select
                    value={filterTeam}
                    onChange={(e) => setFilterTeam(e.target.value)}
                    className="form-select"
                    style={{ backgroundColor: '#121212', color: 'white', border: 'none', width: '250px' }}
                  >
                    <option value="">Todas as Equipas</option>
                    {teams.map(t => <option key={t.idTeam} value={t.name}>{t.name}</option>)}
                  </select>
                </div>

                <div className="me-3 d-flex flex-column">
                  <label className="text-white mb-1">Ano de Nascimento</label>
                  <DatePicker
                    selected={filterBirthYear ? new Date(filterBirthYear, 0, 1) : null}
                    onChange={(date) => setFilterBirthYear(date ? date.getFullYear() : '')}
                    showYearPicker
                    dateFormat="yyyy"
                    placeholderText="Selecionar Ano"
                    customInput={<input style={{ backgroundColor: '#121212', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', width: '200px' }} />}
                  />
                </div>
              </div>

              <div className="d-flex gap-2">
                <button onClick={handleFilterChange} className="btn" style={{ backgroundColor: '#2C2C2C', color: 'white' }}>Aplicar Filtros</button>
                <button onClick={handleClearFilters} className="btn" style={{ backgroundColor: '#2C2C2C', color: 'white' }}>Limpar Filtros</button>
              </div>
            </div>
          )}

          <div className="row">
            {filteredAthletes.length === 0 ? (
              <p className="text-center text-white">Nenhum atleta encontrado.</p>
            ) : (
              filteredAthletes.map(a => (
                <div className="col-md-3 mb-4" key={a.idAthlete}>
                  <Card
                    nome={a.name}
                    descricao={a.position?.name}
                    onEdit={isAdmin ? () => handleEdit(a.idAthlete) : undefined}
                    onDelete={isAdmin ? () => handleDelete(a.idAthlete) : undefined}
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

export default AthletesPage;
