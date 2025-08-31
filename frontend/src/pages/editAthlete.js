import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";

const EditAthlete = () => {
  const { idAthlete } = useParams();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  const [athlete, setAthlete] = useState({
    name: "",
    birthDate: "",
    nationality: "",
    birthplace: "",
    link: "",
    rating: "",
    idGuardian: "",
    idTeam: "",
    idPosition: "",
  });

  const [positions, setPositions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [guardians, setGuardians] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Buscar dados do atleta
  const fetchAthlete = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axios.get(`${apiUrl}/athletes/${idAthlete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAthlete({
        name: data.name,
        birthDate: data.birthDate.split("T")[0],
        nationality: data.nationality,
        birthplace: data.birthplace,
        link: data.link || "",
        rating: data.rating || "",
        idGuardian: data.idGuardian || "",
        idTeam: data.idTeam || "",
        idPosition: data.idPosition || "",
      });
    } catch (error) {
      console.error("Erro ao buscar atleta:", error);
      setMessage("Erro ao carregar dados do atleta.");
    }
  }, [apiUrl, idAthlete]);

  // 🔹 Buscar listas
  const fetchOptions = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const [posRes, teamRes, guardianRes] = await Promise.all([
        axios.get(`${apiUrl}/positions`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${apiUrl}/teams`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${apiUrl}/guardians`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setPositions(posRes.data);
      setTeams(teamRes.data);
      setGuardians(guardianRes.data);
    } catch (error) {
      console.error("Erro ao buscar opções:", error);
      setMessage("Erro ao carregar opções.");
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchAthlete();
    fetchOptions();
  }, [fetchAthlete, fetchOptions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAthlete((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(`${apiUrl}/athletes/${idAthlete}`, athlete, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Atleta atualizado com sucesso!");
      setTimeout(() => navigate("/athletes"), 1500);
    } catch (error) {
      console.error("Erro ao atualizar atleta:", error);
      setMessage(error.response?.data?.error || "Erro ao atualizar atleta.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", backgroundColor: "#121212", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <div className="card" style={{ maxWidth: "600px", margin: "0 auto", background: "#121212", border: "none" }}>
          <h2 className="text-center mb-4 text-white">Editar Atleta</h2>

          {message && <p className="text-white text-center">{message}</p>}

          <form onSubmit={handleSubmit}>
            {["name", "birthDate", "nationality", "birthplace", "link", "rating"].map((field) => (
              <div className="mb-3" key={field}>
                <input
                  type={
                    field === "birthDate"
                      ? "date"
                      : field === "rating"
                      ? "number"
                      : "text"
                  }
                  className="form-control"
                  name={field}
                  value={athlete[field] || ""}
                  onChange={handleChange}
                  placeholder={
                    field === "link"
                      ? "Link (opcional)"
                      : field === "rating"
                      ? "Classificação (0-5)"
                      : `Digite ${field}`
                  }
                  required={field !== "link" && field !== "rating"}
                  min={field === "rating" ? 0 : undefined}
                  max={field === "rating" ? 5 : undefined}
                  style={{ background: "#2c2c2c", color: "white", border: "none" }}
                />
              </div>
            ))}

            <div className="mb-3">
              <select
                className="form-control"
                name="idGuardian"
                value={athlete.idGuardian}
                onChange={handleChange}
                style={{ background: "#2c2c2c", color: "white", border: "none" }}
              >
                <option value="">Selecione o Encarregado</option>
                {guardians.map((g) => (
                  <option key={g.idGuardian} value={g.idGuardian}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <select
                className="form-control"
                name="idTeam"
                value={athlete.idTeam}
                onChange={handleChange}
                style={{ background: "#2c2c2c", color: "white", border: "none" }}
              >
                <option value="">Selecione a Equipa</option>
                {teams.map((t) => (
                  <option key={t.idTeam} value={t.idTeam}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <select
                className="form-control"
                name="idPosition"
                value={athlete.idPosition}
                onChange={handleChange}
                style={{ background: "#2c2c2c", color: "white", border: "none" }}
              >
                <option value="">Selecione a Posição</option>
                {positions.map((p) => (
                  <option key={p.idPosition} value={p.idPosition}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              style={{ background: "black", border: "none"}}
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

export default EditAthlete;
