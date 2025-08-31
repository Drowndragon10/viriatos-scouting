import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { FaEdit, FaTimes } from "react-icons/fa";
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
  const [filterTeam, setFilterTeam] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [expandedAthleteId, setExpandedAthleteId] = useState(null);
  const [reports, setReports] = useState({}); // <--- para armazenar se atleta já tem relatório
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_BACKEND_URL;
  const userRole = getUserRoleFromToken(); // role do usuário logado

  useEffect(() => {
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

        // buscar relatórios existentes
        const reportsObj = {};
        for (let athlete of athletesRes.data) {
          try {
            const res = await axios.get(`${apiUrl}/reports/athlete/${athlete.idAthlete}`, config);
            reportsObj[athlete.idAthlete] = !!res.data; // true se já tiver relatório
          } catch {
            reportsObj[athlete.idAthlete] = false;
          }
        }
        setReports(reportsObj);

      } catch (err) {
        setError('Erro ao carregar os dados.');
      }
    };

    fetchData();
  }, [apiUrl, userRole]);

  const handleEdit = (idAthlete) => {
    alert(`Editar atleta ${idAthlete}`);
  };

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
    if (filterTeam) filtered = filtered.filter(a => a.team?.name === filterTeam);
    setAthletes(filtered);
  };

  const handleClearFilters = () => {
    setFilterPosition('');
    setFilterBirthYear('');
    setFilterTeam('');
    setAthletes(allAthletes);
  };

  const filteredAthletes = athletes.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAthlete = () => navigate("/athlete/create");
  const handleCreateReport = (idAthlete) => navigate(`/report/${idAthlete}`);

  if (error) return <div className="text-center py-10">{error}</div>;

  return (
    <div style={{ display: "flex", backgroundColor: "#121212", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <div className="mt-5" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 className="mb-2 text-white">Atletas</h2>
          <hr />
          {message && <p className="text-white mb-3">{message}</p>}

          <div className="d-flex justify-content-between mb-4">
            <div className="d-flex gap-3">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Pesquisar por nome"
                className="form-control"
                style={{ backgroundColor: '#2C2C2C', width: '300px', border: 'none', color: 'white' }}
              />
              <button onClick={toggleFilters} className="btn text-white" style={{ backgroundColor: '#2C2C2C', border: 'none' }}>
                Filtros ▾
              </button>
            </div>

            {isAdmin && (
              <button
                onClick={handleAddAthlete}
                className="btn"
                style={{ backgroundColor: "#2C2C2C", color: "white", border: "none" }}
              >
                + Adicionar Atleta
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
                    style={{ backgroundColor: '#2C2C2C', color: 'white', border: 'none', width: '180px' }}
                  >
                    <option value="">Todas as Posições</option>
                    {positions.map(p => <option key={p.idPosition} value={p.name}>{p.name}</option>)}
                  </select>
                </div>

                <div className="me-3">
                  <label className="text-white mb-1">Clube</label>
                  <select
                    value={filterTeam}
                    onChange={(e) => setFilterTeam(e.target.value)}
                    className="form-select"
                    style={{ backgroundColor: '#2C2C2C', color: 'white', border: 'none', width: '250px' }}
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
                    customInput={<input style={{ backgroundColor: '#2C2C2C', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', width: '200px' }} />}
                  />
                </div>
              </div>

              <div className="d-flex gap-2">
                <button onClick={handleFilterChange} className="btn" style={{ backgroundColor: '#121212', color: 'white' }}>Aplicar Filtros</button>
                <button onClick={handleClearFilters} className="btn" style={{ backgroundColor: '#121212', color: 'white' }}>Limpar Filtros</button>
              </div>
            </div>
          )}

          <div className="table-responsive">
            <table className="table-custom">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Posição</th>
                  <th>Equipa</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredAthletes.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-white">
                      Nenhum atleta encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredAthletes.map(a => (
                    <React.Fragment key={a.idAthlete}>
                      <tr>
                        <td>{a.name}</td>
                        <td>{a.position?.name}</td>
                        <td>{a.team?.name}</td>
                        <td>
                          <button
                            className="btn"
                            style={{ backgroundColor: "#2C2C2C", color: "white", border: "none" }}
                            onClick={() =>
                              setExpandedAthleteId(expandedAthleteId === a.idAthlete ? null : a.idAthlete)
                            }
                          >
                            Detalhes
                          </button>
                          {isAdmin && (
                            <>
                              <FaEdit
                                style={{ cursor: "pointer", marginLeft: "1rem" }}
                                onClick={() => handleEdit(a.idAthlete)}
                              />
                              <FaTimes
                                className="text-danger"
                                style={{ cursor: "pointer", marginLeft: "0.5rem" }}
                                onClick={() => handleDelete(a.idAthlete)}
                              />
                            </>
                          )}
                        </td>
                      </tr>

                      {expandedAthleteId === a.idAthlete && (
                        <tr style={{ backgroundColor: "#1a1a1a" }}>
                          <td colSpan="4">
                            <div>
                              <p><strong>Nome:</strong> {a.name}</p>
                              <p><strong>Data de Nascimento:</strong> {new Date(a.birthDate).toLocaleDateString()}</p>
                              <p><strong>Posição:</strong> {a.position?.name || "N/A"}</p>
                              <p><strong>Equipa:</strong> {a.team?.name || "N/A"}</p>
                              <p><strong>Pé Preferido:</strong> {a.preferredFoot || "N/A"}</p>
                              <p><strong>Altura:</strong> {a.height ? `${a.height} cm` : "N/A"}</p>
                              <p><strong>Peso:</strong> {a.weight ? `${a.weight} kg` : "N/A"}</p>
                              <p><strong>Nacionalidade:</strong> {a.nationality || "N/A"}</p>

                              {/* Botão Criar Relatório para Olheiro */}
                              {userRole === 3 && (
                                <button
                                  onClick={() => handleCreateReport(a.idAthlete)}
                                  className="btn"
                                  style={{
                                    backgroundColor: reports[a.idAthlete] ? "grey" : "gold",
                                    color: reports[a.idAthlete] ? "#ccc" : "black",
                                    fontWeight: "bold",
                                    marginTop: "10px",
                                    cursor: reports[a.idAthlete] ? "not-allowed" : "pointer",
                                  }}
                                  disabled={reports[a.idAthlete]}
                                >
                                  Criar Relatório
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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

export default AthletesPage;
