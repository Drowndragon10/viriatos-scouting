import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/sidebar';

const AssignTask = () => {
  const [jogos, setJogos] = useState([]);
  const [atletas, setAtletas] = useState([]);
  const [utilizadores, setUtilizadores] = useState([]);
  const [tarefaData, setTarefaData] = useState({
    idMatch: '',
    idAthlete: '',
    idUser: '',
    title: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [jogosRes, atletasRes, usersRes] = await Promise.all([
          axios.get(`${apiUrl}/matches`, config),
          axios.get(`${apiUrl}/athletes`, config),
          axios.get(`${apiUrl}/auth/users`, config),
        ]);

        setJogos(jogosRes.data);
        setAtletas(atletasRes.data);

        // Filtrar apenas utilizadores do tipo Olheiro (idTipoUtilizador === 3)
        setUtilizadores(usersRes.data.filter(user => user.idUserType === 3));
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    fetchData();
  }, [apiUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTarefaData({ ...tarefaData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.post(`${apiUrl}/tasks`, tarefaData, config);

      // Resetar campos após criação
      setTarefaData({
        idMatch: '',
        idAthlete: '',
        idUser: '',
        title: '',
        description: '',
      });

    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', backgroundColor: '#121212', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', padding: '20px', flex: 1 }}>
        <div className="card" style={{ width: '100%', maxWidth: '600px', backgroundColor: '#121212', border: 'none' }}>
          <h2 className="card-title text-center mb-4" style={{ color: 'white' }}>Criar Nova Tarefa</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <select
                name="idMatch"
                value={tarefaData.idMatch}
                onChange={handleChange}
                required
                className="form-select"
                style={{ backgroundColor: '#2C2C2C', color: 'white', border: 'none'}}
              >
                <option value="">Selecione um jogo</option>
                {jogos.map(jogo => {
                  const equipaCasa = jogo.teams.find(e => e.role === "home");
                  const equipaVisitante = jogo.teams.find(e => e.role === "away");
                  return (
                    <option key={jogo.match.idMatch} value={jogo.match.idMatch}>
                      {equipaCasa?.team.name} vs {equipaVisitante?.team.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <select
                name="idAthlete"
                value={tarefaData.idAthlete}
                onChange={handleChange}
                required
                className="form-select"
                style={{ backgroundColor: '#2C2C2C', color: 'white', border: 'none'}}
              >
                <option value="">Selecione um atleta</option>
                {atletas.map(atleta => (
                  <option key={atleta.idAthlete} value={atleta.idAthlete}>
                    {atleta.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <select
                name="idUser"
                value={tarefaData.idUser}
                onChange={handleChange}
                required
                className="form-select"
                style={{ backgroundColor: '#2C2C2C', color: 'white', border: 'none'}}
              >
                <option value="">Selecione um utilizador</option>
                {utilizadores.map(user => (
                  <option key={user.idUser} value={user.idUser}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                name="title"
                value={tarefaData.title}
                onChange={handleChange}
                required
                placeholder="Título da Tarefa"
                className="form-control"
                style={{ backgroundColor: '#2C2C2C', color: 'white', border: 'none'}}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <textarea
                name="description"
                value={tarefaData.description}
                onChange={handleChange}
                required
                placeholder="Descrição da Tarefa"
                className="form-control"
                style={{ backgroundColor: '#2C2C2C', color: 'white', border: 'none'}}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-100 mt-3"
              style={{ backgroundColor: '#000', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              {isLoading ? 'Aguarde...' : 'Criar Tarefa'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignTask;
