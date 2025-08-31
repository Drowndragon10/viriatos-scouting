import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";

const EditTeam = () => {
  const { idTeam } = useParams();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  const [team, setEquipa] = useState({
    name: "",
    district: "",
    county: "",
    idAgeCategory: "",
    idTeamType: "",
    idUser: "",
  });

  const [ageCategories, setAgeCategories] = useState([]);
  const [teamTypes, setTeamTypes] = useState([]);
  const [users, setUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Buscar team
  const fetchEquipa = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axios.get(`${apiUrl}/teams/${idTeam}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEquipa({
        name: data.name,
        district: data.district,
        county: data.county,
        idAgeCategory: data.idAgeCategory,
        idTeamType: data.idTeamType,
        idUser: data.idUser,
      });
    } catch (error) {
      console.error("Erro ao buscar team:", error);
      setMessage("Erro ao carregar dados da team.");
    }
  }, [apiUrl, idTeam]);

  // 🔹 Buscar categorias, tipos e users
  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");

      const [ageRes, typeRes, userRes] = await Promise.all([
        axios.get(`${apiUrl}/ageCategories`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${apiUrl}/teamTypes`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${apiUrl}/auth/users`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setAgeCategories(ageRes.data);
      setTeamTypes(typeRes.data);
      setUsers(userRes.data.filter((u) => u.idUserType === 2));
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setMessage("Erro ao carregar categorias, tipos de team ou utilizadores.");
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchEquipa();
    fetchData();
  }, [fetchEquipa, fetchData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEquipa((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(`${apiUrl}/teams/${idTeam}`, team, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Equipa atualizada com sucesso!");
      setTimeout(() => navigate("/teams"), 1500);
    } catch (error) {
      console.error("Erro ao atualizar team:", error);
      setMessage(error.response?.data?.error || "Erro ao atualizar team.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", backgroundColor: "#121212", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <div
          className="card"
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            background: "#121212",
            border: "none",
          }}
        >
          <h2 className="text-center mb-4 text-white">Editar Equipa</h2>

          {message && <p className="text-white text-center">{message}</p>}

          <form onSubmit={handleSubmit}>
            {/* Nome */}
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                name="name"
                value={team.name || ""}
                onChange={handleChange}
                placeholder="Digite o nome"
                required
                style={{ background: "#2c2c2c", color: "white", border: "none" }}
              />
            </div>

            {/* Distrito */}
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                name="district"
                value={team.district || ""}
                onChange={handleChange}
                placeholder="Digite o distrito"
                style={{ background: "#2c2c2c", color: "white", border: "none" }}
              />
            </div>

            {/* Concelho */}
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                name="county"
                value={team.county || ""}
                onChange={handleChange}
                placeholder="Digite o concelho"
                style={{ background: "#2c2c2c", color: "white", border: "none" }}
              />
            </div>

            {/* Categoria de Idade */}
            <div className="mb-3">
              <select
                className="form-control"
                name="idAgeCategory"
                value={team.idAgeCategory || ""}
                onChange={handleChange}
                required
                style={{ background: "#2c2c2c", color: "white", border: "none" }}
              >
                <option value="">Selecione a Categoria</option>
                {ageCategories.map((cat) => (
                  <option key={cat.idAgeCategory} value={cat.idAgeCategory}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo de Equipa */}
            <div className="mb-3">
              <select
                className="form-control"
                name="idTeamType"
                value={team.idTeamType || ""}
                onChange={handleChange}
                required
                style={{ background: "#2c2c2c", color: "white", border: "none" }}
              >
                <option value="">Selecione o Tipo de Equipa</option>
                {teamTypes.map((type) => (
                  <option key={type.idTeamType} value={type.idTeamType}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Treinador */}
            <div className="mb-3">
              <select
                className="form-control"
                name="idUser"
                value={team.idUser || ""}
                onChange={handleChange}
                required
                style={{ background: "#2c2c2c", color: "white", border: "none" }}
              >
                <option value="">Selecione o Treinador</option>
                {users.map((user) => (
                  <option key={user.idUser} value={user.idUser}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              style={{ background: "black", border: "none" }}
              disabled={isLoading}
            >
              {isLoading ? "Atualizando..." : "Atualizar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTeam;
