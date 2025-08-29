import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TarefasAdmin = () => {
  const [tarefas, setTarefas] = useState([]);
  const [jogos, setJogos] = useState([]);
  const [filtroOlheiro, setFiltroOlheiro] = useState('');
  const [filtroAtleta, setFiltroAtleta] = useState('');
  const apiUrl = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    const carregarTarefas = async () => {
      try {
        const response = await axios.get(`${apiUrl}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTarefas(response.data);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      }
    };

    const carregarJogos = async () => {
      try {
        const response = await axios.get(`${apiUrl}/matches`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJogos(response.data);
      } catch (error) {
        console.error("Erro ao buscar jogos:", error);
      }
    };

    carregarTarefas();
    carregarJogos();
  }, [apiUrl, token]);

  const getEquipasDoJogo = (idMatch) => {
    const jogo = jogos.find((j) => j.match.idMatch === idMatch);
    if (jogo && Array.isArray(jogo.teams) && jogo.teams.length > 0) {
      const equipaCasa = jogo.teams.find((t) => t.role === "Casa");
      const equipaVisitante = jogo.teams.find((t) => t.role === "Visitante");
      return `${equipaCasa ? equipaCasa.team.name : "Casa"} vs ${equipaVisitante ? equipaVisitante.team.name : "Visitante"}`;
    }
    return "Sem equipas";
  };

  const atribuirTarefa = () => navigate("/task/assign");

  // Filtro de tarefas por olheiro e atleta
  const tarefasFiltradas = tarefas.filter((tarefa) => {
    const olheiroMatch = filtroOlheiro ? tarefa.user.name === filtroOlheiro : true;
    const atletaMatch = filtroAtleta ? tarefa.athlete?.name === filtroAtleta : true;
    return olheiroMatch && atletaMatch;
  });

  return (
    <div style={{ display: "flex", backgroundColor: "#121212", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <div className="mt-5" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 className="text-white mb-2">Tarefas</h2>
<hr/>
          <div className="d-flex justify-content-between mb-4">
            <div className="d-flex gap-3">
              {/* Filtro por olheiro */}
              <select
                className="form-select"
                style={{ width: "200px", backgroundColor: "#2C2C2C", color: "white", border: "none" }}
                value={filtroOlheiro}
                onChange={(e) => setFiltroOlheiro(e.target.value)}
              >
                <option value="">Todos os Olheiros</option>
                {Array.from(new Set(tarefas.map((t) => t.user.name)))
                  .filter((nome) => nome)
                  .map((nome) => (
                    <option key={nome} value={nome}>{nome}</option>
                  ))}
              </select>

              {/* Filtro por atleta */}
              <select
                className="form-select"
                style={{ width: "200px", backgroundColor: "#2C2C2C", color: "white", border: "none" }}
                value={filtroAtleta}
                onChange={(e) => setFiltroAtleta(e.target.value)}
              >
                <option value="">Todos os Atletas</option>
                {Array.from(new Set(tarefas.map((t) => t.athlete?.name)))
                  .filter((nome) => nome)
                  .map((nome) => (
                    <option key={nome} value={nome}>{nome}</option>
                  ))}
              </select>
            </div>

            {/* Botão para atribuir tarefa */}
            <button
              onClick={atribuirTarefa}
              className="btn"
              style={{ backgroundColor: "#2C2C2C", color: "#ffffff", width: "150px" }}
            >
              + Atribuir Tarefa
            </button>
          </div>

          {tarefasFiltradas.length === 0 ? (
            <p className="text-center text-white" style={{ fontSize: "18px" }}>
              Não foram encontradas tarefas.
            </p>
          ) : (
            <table className="table-custom" style={{ backgroundColor: "#2C2C2C", color: "white" }}>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Descrição</th>
                  <th>Atleta</th>
                  <th>Jogo</th>
                  <th>Data</th>
                  <th>Estado</th>
                  <th>Utilizador</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {tarefasFiltradas.map((tarefa, index) => (
                  <tr key={index}>
                    <td>{tarefa.title}</td>
                    <td>{tarefa.description}</td>
                    <td>{tarefa.athlete ? tarefa.athlete.name : "Atleta não atribuído"}</td>
                    <td>{getEquipasDoJogo(tarefa.idMatch)}</td>
                    <td>{new Date(tarefa.taskDate).toLocaleDateString()}</td>
                    <td>{tarefa.status}</td>
                    <td>{tarefa.user.name}</td>
                    <td>{tarefa.user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TarefasAdmin;
