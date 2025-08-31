import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar";
import { getUserIdFromToken } from "../components/jwtDecode";
import { useNavigate } from "react-router-dom";

const TarefasOlheiro = () => {
  const [tarefas, setTarefas] = useState([]);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [jogos, setJogos] = useState([]);
  const [relatorios, setRelatorios] = useState([]);
  const apiUrl = process.env.REACT_APP_BACKEND_URL;
  const idUser = getUserIdFromToken();
  const navigate = useNavigate();

  useEffect(() => {
    const carregarTarefas = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${apiUrl}/tasks/user/${idUser}`, config);
        setTarefas(response.data);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      }
    };

    const carregarJogos = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${apiUrl}/matches`, config);
        setJogos(response.data);
      } catch (error) {
        console.error("Erro ao buscar jogos:", error);
      }
    };

    const carregarRelatorios = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${apiUrl}/reports`, config);
        setRelatorios(response.data);
      } catch (error) {
        console.error("Erro ao buscar relatórios:", error);
      }
    };

    carregarTarefas();
    carregarJogos();
    carregarRelatorios();
  }, [apiUrl, idUser]);

  const getEquipasDoJogo = (idMatch) => {
    const jogo = jogos.find((j) => j.match.idMatch === idMatch);
    if (jogo && Array.isArray(jogo.equipas) && jogo.equipas.length > 0) {
      const casa = jogo.equipas.find((e) => e.papel === "casa");
      const visitante = jogo.equipas.find((e) => e.papel === "visitante");
      return `${casa ? casa.equipa.nome : "Equipa Casa"} vs ${visitante ? visitante.equipa.nome : "Equipa Visitante"}`;
    }
    return "Sem equipas";
  };

  const criarRelatorio = (tarefa) => {
    if (tarefa?.athlete?.idAthlete) {
      navigate(`/relatorio/${tarefa.athlete.idAthlete}`);
    }
  };

  // verifica se já existe relatório para o atleta
  const hasRelatorio = (idAthlete) => {
    return relatorios.some((r) => r.athlete?.idAthlete === idAthlete);
  };

  return (
    <div style={{ display: "flex", backgroundColor: "#121212", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <div className="mt-5" style={{ flex: 1, overflowY: "auto" }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 className="mb-2 text-white">Minhas Tarefas</h2>
          <hr />

          {tarefas.length === 0 ? (
            <p className="text-center text-white" style={{ fontSize: "18px" }}>
              Não foram encontradas tarefas.
            </p>
          ) : (
            <table className="table-custom" style={{ backgroundColor: "#2C2C2C", color: "white" }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Atleta</th>
                  <th>Jogo</th>
                  <th>Data</th>
                  <th>Estado</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {tarefas.map((tarefa) => {
                  const dataFormatada = new Date(tarefa.taskDate).toLocaleDateString();
                  const atletaNome = tarefa.athlete?.name || "N/A";
                  const jogoInfo = getEquipasDoJogo(tarefa.idMatch);

                  return (
                    <React.Fragment key={tarefa.idTask}>
                      <tr>
                        <td>{tarefa.idTask}</td>
                        <td>{tarefa.title}</td>
                        <td>{atletaNome}</td>
                        <td>{jogoInfo}</td>
                        <td>{dataFormatada}</td>
                        <td>{tarefa.status}</td>
                        <td>
                          <button
                            className="btn"
                            style={{ backgroundColor: "#2C2C2C", color: "white", border: "none", width: "120px" }}
                            onClick={() =>
                              setExpandedTaskId(expandedTaskId === tarefa.idTask ? null : tarefa.idTask)
                            }
                          >
                            Detalhes
                          </button>
                        </td>
                      </tr>

                      {expandedTaskId === tarefa.idTask && (
                        <tr style={{ backgroundColor: "#1a1a1a" }}>
                          <td colSpan="7">
                            <div>
                              <p><strong>Descrição:</strong> {tarefa.description || "Sem descrição"}</p>
                              <p><strong>Olheiro:</strong> {tarefa.user?.name || "N/A"}</p>

                              {tarefa?.athlete?.idAthlete && (
                                <button
                                  className="btn"
                                  style={{
                                    backgroundColor: hasRelatorio(tarefa.athlete.idAthlete) ? "#555" : "#FDD522",
                                    color: "white",
                                    border: "none",
                                    padding: "8px 16px",
                                    marginTop: "10px",
                                    borderRadius: "5px",
                                    cursor: hasRelatorio(tarefa.athlete.idAthlete) ? "not-allowed" : "pointer",
                                  }}
                                  disabled={hasRelatorio(tarefa.athlete.idAthlete)}
                                  onClick={() => criarRelatorio(tarefa)}
                                >
                                  {hasRelatorio(tarefa.athlete.idAthlete) ? "Relatório Existente" : "Criar Relatório"}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TarefasOlheiro;
