import React, { useState, useEffect } from 'react';
import Sidebar from "../components/sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';

const PaginaConvidar = () => {
  const [email, setEmail] = useState('');
  const [tipoUtilizador, setTipoUtilizador] = useState('');
  const [tiposUtilizador, setTiposUtilizador] = useState([]);
  const token = localStorage.getItem("authToken");
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchTiposUtilizador = async () => {
      try {
        const response = await fetch(`${apiUrl}/userTypes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (Array.isArray(data)) setTiposUtilizador(data);
      } catch (error) {
        console.error('Erro ao buscar tipos de utilizador:', error);
        setTiposUtilizador([]);
      }
    };

    fetchTiposUtilizador();
  }, [token, apiUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tipoSelecionado = tiposUtilizador.find(tipo => tipo.idUserType === parseInt(tipoUtilizador));
    if (!tipoSelecionado) {
      console.error('Tipo de utilizador inválido.');
      return;
    }

    const requestData = {
      email: email,
      idUserType: tipoSelecionado.idUserType,
    };

    try {
      await fetch(`${apiUrl}/auth/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      // Resetar campos após criação
      setEmail('');
      setTipoUtilizador('');
    } catch (error) {
      console.error('Erro ao enviar o convite:', error);
    }
  };

  return (
    <div className="d-flex" style={{ backgroundColor: "#121212", minHeight: "100vh" }}>
      <Sidebar />
      <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 p-3">
        <div className="container d-flex justify-content-center">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="card" style={{ backgroundColor: '#121212', border: 'none', padding: '30px' }}>
              <div className="card-body" style={{ padding: '40px' }}>
                <h2 className="text-center mb-5 text-white">Convidar Utilizador</h2>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label text-white">Email do Utilizador a Convidar</label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      placeholder="Insira o email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ backgroundColor: '#2C2C2C', color: '#fff', border: 'none' }}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="tipoUtilizador" className="form-label text-white">Role do Utilizador</label>
                    <select
                      id="tipoUtilizador"
                      className="form-select"
                      required
                      value={tipoUtilizador}
                      onChange={(e) => setTipoUtilizador(e.target.value)}
                      style={{ backgroundColor: '#2C2C2C', color: '#fff', border: 'none' }}
                    >
                      <option value="">Selecione o tipo</option>
                      {Array.isArray(tiposUtilizador) && tiposUtilizador.map((tipo) => (
                        <option key={tipo.idUserType} value={tipo.idUserType}>{tipo.name}</option>
                      ))}
                    </select>
                  </div>

                  <button type="submit" className="btn btn-warning w-100">
                    Convidar Utilizador
                  </button>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaConvidar;
