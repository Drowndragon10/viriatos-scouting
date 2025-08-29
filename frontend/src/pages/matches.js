import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { getUserRoleFromToken } from "../components/jwtDecode";
import { FaEdit, FaTrash } from "react-icons/fa";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [ageCategories, setAgeCategories] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [ageCategoryFilter, setAgeCategoryFilter] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const userRole = getUserRoleFromToken();
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${apiUrl}/matches/`, config);
        setMatches(response.data);
      } catch (err) {
        console.error("Erro ao buscar os jogos:", err);
        setError("Erro ao carregar os jogos.");
      }
    };

    const fetchAgeCategories = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${apiUrl}/ageCategories/`, config);
        setAgeCategories(response.data);
      } catch (err) {
        console.error("Erro ao buscar as classificações etárias:", err);
      }
    };

    fetchMatches();
    fetchAgeCategories();
  }, [apiUrl]);

  const handleAdd = () => navigate("/match/create");

  const handleEdit = (idMatch) => navigate(`/match/edit/${idMatch}`);

  const handleDelete = async (idMatch) => {
    if (!window.confirm("Tens a certeza que queres eliminar este jogo?")) return;

    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${apiUrl}/matches/${idMatch}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMatches((prev) => prev.filter((m) => m.match.idMatch !== idMatch));
    } catch (err) {
      console.error("Erro ao eliminar jogo:", err);
    }
  };

  const filteredMatches = matches.filter((m) => {
    const matchDate = new Date(m.match.matchDate).toLocaleDateString();

    if (dateFilter && matchDate !== new Date(dateFilter).toLocaleDateString()) return false;

    if (
      ageCategoryFilter &&
      !m.teams.some((t) => t.team.idAgeCategory === parseInt(ageCategoryFilter))
    ) return false;

    return true;
  });

  if (error) return <div className="text-center py-10 text-white">{error}</div>;

  return (
    <div style={{ display: "flex", backgroundColor: "#121212", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <div className="mt-5" style={{ flex: 1, overflowY: "auto" }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 className="mb-2 text-white">Jogos</h2>
<hr/>
          <div className="d-flex justify-content-between mb-5">
            <div className="d-flex gap-3">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="form-control"
                style={{ backgroundColor: "#2C2C2C", width: "200px", border: "none", color: "white" }}
              />
              <select
                value={ageCategoryFilter}
                onChange={(e) => setAgeCategoryFilter(e.target.value)}
                className="form-select"
                style={{ backgroundColor: "#2C2C2C", width: "200px", border: "none", color: "white" }}
              >
                <option value="">Classificação Etária</option>
                {ageCategories.map((cat) => (
                  <option key={cat.idAgeCategory} value={cat.idAgeCategory}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {userRole === 1 && (
              <button
                onClick={handleAdd}
                className="btn"
                style={{ backgroundColor: "#2C2C2C", color: "#ffffff", borderRadius: "10px", padding: "7px 20px" }}
              >
                + Adicionar Jogo
              </button>
            )}
          </div>

          <table className="table-custom">
            <thead>
              <tr>
                <th>Equipa Casa</th>
                <th>Equipa Visitante</th>
                <th>Data</th>
                <th>Concelho</th>
                <th>Distrito</th>
                {userRole === 1 && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {filteredMatches.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-white">
                    Nenhum jogo encontrado.
                  </td>
                </tr>
              ) : (
                filteredMatches.map((matchData) => {
                  const homeTeam = matchData.teams.find((t) => t.role === "casa")?.team?.name || "N/A";
                  const awayTeam = matchData.teams.find((t) => t.role === "visitante")?.team?.name || "N/A";
                  const formattedDate = matchData.match.matchDate
                    ? new Date(matchData.match.matchDate).toLocaleString()
                    : "Sem data";

                  return (
                    <tr key={matchData.match.idMatch}>
                      <td>{homeTeam}</td>
                      <td>{awayTeam}</td>
                      <td>{formattedDate}</td>
                      <td>{matchData.match.county}</td>
                      <td>{matchData.match.district}</td>
                      {userRole === 1 && (
                        <td>
                          <FaEdit
                            style={{ cursor: "pointer", marginRight: "1rem" }}
                            onClick={() => handleEdit(matchData.match.idMatch)}
                          />
                          <FaTrash
                            className="text-danger"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleDelete(matchData.match.idMatch)}
                          />
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Matches;
