import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Card from "../components/Card";
import { getUserRoleFromToken, getUserIdFromToken } from "../components/jwtDecode";

const TeamsList = () => {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [nameFilter, setNameFilter] = useState("");
  const [ageCategoryFilter, setAgeCategoryFilter] = useState("");
  const [teamTypeFilter, setTeamTypeFilter] = useState("");
  const [ageCategories, setAgeCategories] = useState([]);
  const [teamTypes, setTeamTypes] = useState([]);
  const navigate = useNavigate();
  const userRole = getUserRoleFromToken();
  const userId = getUserIdFromToken();
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        let url = `${apiUrl}/teams`;
        if (userRole === 2) {
          url = `${apiUrl}/teams/coach/${userId}`;
        }

        const response = await axios.get(url, config);
        setTeams(response.data);
      } catch (err) {
        console.error(err);
        setError("Error fetching teams.");
      }
    };

    const fetchAgeCategories = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${apiUrl}/ageCategories`, config);
        setAgeCategories(response.data);
      } catch (err) {
        console.error("Error fetching age categories:", err);
      }
    };

    const fetchTeamTypes = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${apiUrl}/teamTypes`, config);
        setTeamTypes(response.data);
      } catch (err) {
        console.error("Error fetching team types:", err);
      }
    };

    fetchTeams();
    fetchAgeCategories();
    fetchTeamTypes();
  }, [userRole, userId, apiUrl]);

  const filterTeams = () => {
    if (!Array.isArray(teams)) return [];

    return teams.filter((team) => {
      const matchName = team.name.toLowerCase().includes(nameFilter.toLowerCase());
      const matchAgeCategory = ageCategoryFilter
        ? team.idAgeCategory === Number(ageCategoryFilter)
        : true;
      const matchTeamType = teamTypeFilter
        ? team.idTeamType === Number(teamTypeFilter)
        : true;

      return matchName && matchAgeCategory && matchTeamType;
    });
  };

  const handleEdit = (teamId) => {
    navigate(`/editteam/${teamId}`);
  };

  const handleDelete = async (teamId) => {
    try {
      const token = localStorage.getItem("authToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${apiUrl}/teams/${teamId}`, config);
      setTeams(teams.filter((team) => team.idTeam !== teamId));
    } catch (error) {
      console.error("Error deleting the team:", error);
    }
  };

  const handleAdd = () => {
    navigate("/team/create");
  };

  if (error) return <div className="text-center py-10">{error}</div>;

  return (
    <div style={{ display: "flex", backgroundColor: "#2C2C2C", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <div className="mt-5" style={{ flex: 1, overflowY: "auto" }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 className="mb-5 text-white">Teams</h2>

          {/* Filters and Add Button */}
          <div className="d-flex flex-wrap justify-content-between mb-5">
            <div className="d-flex flex-wrap gap-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                style={{ backgroundColor: "#121212", width: "250px", border: "none", color: "white" }}
              />

              <select
                className="form-select"
                value={ageCategoryFilter}
                onChange={(e) => setAgeCategoryFilter(e.target.value)}
                style={{ backgroundColor: "#121212", width: "200px", border: "none", color: "white" }}
              >
                <option value="">All Age Categories</option>
                {ageCategories.map((category) => (
                  <option key={category.idAgeCategory} value={category.idAgeCategory}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                className="form-select"
                value={teamTypeFilter}
                onChange={(e) => setTeamTypeFilter(e.target.value)}
                style={{ backgroundColor: "#121212", width: "200px", border: "none", color: "white" }}
              >
                <option value="">All Team Types</option>
                {teamTypes.map((type) => (
                  <option key={type.idTeamType} value={type.idTeamType}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {userRole === 1 && (
              <button
                onClick={handleAdd}
                className="btn"
                style={{
                  backgroundColor: "#121212",
                  color: "#ffffff",
                  borderRadius: "10px",
                  padding: "7px 20px",
                }}
              >
                + Add Team
              </button>
            )}
          </div>

          <div className="row">
            {filterTeams().length === 0 ? (
              <p className="text-center text-white">No teams found.</p>
            ) : (
              filterTeams().map((team) => (
                <div className="col-md-3 mb-4" key={team.idTeam}>
                  <Card
                    nome={team.name}
                    descricao={team.district}
                    onEdit={() => handleEdit(team.idTeam)}
                    onDelete={() => handleDelete(team.idTeam)}
                  >
                    {userRole === 2 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/roster/${team.idTeam}`);
                        }}
                        className="btn mt-3"
                        style={{
                          backgroundColor: "#2C2C2C",
                          width: "100px",
                          border: "none",
                          color: "white",
                        }}
                      >
                        Roster
                      </button>
                    )}
                  </Card>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsList;
