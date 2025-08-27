import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBan, FaUnlock, FaEdit, FaCheck, FaTimes } from "react-icons/fa";

const DashboardAdmin = () => {
  const [users, setUsers] = useState([]);
  const [types, setTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterState, setFilterState] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [newRole, setNewRole] = useState("");
  const apiUrl = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const carregarUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.utilizadores);
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
    }
  }, [apiUrl, token]);

  const carregarTipos = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/tiposUtilizadores/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTypes(response.data);
    } catch (error) {
      console.error("Erro ao carregar tipos de utilizador:", error);
    }
  }, [apiUrl, token]);

  useEffect(() => {
    carregarUsers();
    carregarTipos();
  }, [carregarUsers, carregarTipos]);

  const atualizarEstadoUsuario = (idUtilizador, novoEstado) => {
    setUsers(users.map(user =>
      user.idUtilizador === idUtilizador
        ? { ...user, estadoConta: novoEstado }
        : user
    ));
  };

  const editarRole = async (idUtilizador) => {
    try {
      await axios.put(
        `${apiUrl}/admin/users/updateRole/${idUtilizador}`,
        { tipoUtilizador: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Tipo de utilizador atualizado com sucesso");
      setUsers(users.map(user =>
        user.idUtilizador === idUtilizador
          ? { ...user, tipoUtilizador: { nome: newRole } }
          : user
      ));
      setEditingUserId(null);
    } catch (error) {
      console.error("Erro ao atualizar tipo de utilizador:", error);
    }
  };

  const bloquearConta = async (idUtilizador) => {
    try {
      await axios.put(
        `${apiUrl}/admin/users/block/${idUtilizador}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Conta bloqueada com sucesso");
      atualizarEstadoUsuario(idUtilizador, "Inativo");
    } catch (error) {
      console.error("Erro ao bloquear conta:", error);
    }
  };

  const desbloquearConta = async (idUtilizador) => {
    try {
      await axios.put(
        `${apiUrl}/admin/users/unblock/${idUtilizador}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Conta desbloqueada com sucesso");
      atualizarEstadoUsuario(idUtilizador, "Ativo");
    } catch (error) {
      console.error("Erro ao desbloquear conta:", error);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterRole === "" || user.tipoUtilizador?.nome === filterRole) &&
        (filterState === "" || user.estadoConta === filterState)
    );
  }, [users, searchTerm, filterRole, filterState]);

  const currentUsers = useMemo(() => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    return filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  }, [filteredUsers, currentPage, usersPerPage]);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredUsers.length / usersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div style={{ display: "flex", backgroundColor: "#2C2C2C", height: "100vh", overflow: "hidden" }}>
      
      <div className="mt-5" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 className="mb-5 text-white">Administração</h2>
          <div className="d-flex justify-content-between mb-4">
            <div className="d-flex gap-3">
              <input
                type="text"
                placeholder="Pesquisar utilizador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
                style={{ backgroundColor: "#121212", width: "300px", border: "none", color: "white" }}
              />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="form-select"
                style={{ backgroundColor: "#121212", width: "180px", border: "none", color: "white" }}
              >
                <option value="">Todas Permissões</option>
                {types.map((type) => (
                  <option key={type.idTipoUtilizador} value={type.nome}>
                    {type.nome}
                  </option>
                ))}
              </select>
              <select
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="form-select"
                style={{ backgroundColor: "#121212", width: "180px", border: "none", color: "white" }}
              >
                <option value="">Todos Estados</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
            <button
              className="btn"
              onClick={() => navigate("/convidar")}
              style={{ backgroundColor: "#121212", color: "#ffffff", borderRadius: "10px", padding: "7px 20px" }}
            >
              + Convidar Utilizador
            </button>
          </div>
          <div style={{ minHeight: "300px" }}>
            {filteredUsers.length === 0 ? (
              <p className="text-white">Não foram encontrados utilizadores.</p>
            ) : (
              <>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Estado da Conta</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user) => (
                      <tr key={user.idUtilizador}>
                        <td>{user.nome}</td>
                        <td>{user.email}</td>
                        <td>
                          {editingUserId === user.idUtilizador ? (
                            <select
                              value={newRole}
                              onChange={(e) => setNewRole(e.target.value)}
                              className="form-select"
                              style={{ width: "180px" }}
                            >
                              {types.map((type) => (
                                <option key={type.idTipoUtilizador} value={type.nome}>
                                  {type.nome}
                                </option>
                              ))}
                            </select>
                          ) : (
                            user.tipoUtilizador?.nome
                          )}
                        </td>
                        <td>{user.estadoConta}</td>
                        <td>
                          {editingUserId === user.idUtilizador ? (
                            <>
                              <FaCheck
                                className="text-success"
                                style={{ cursor: "pointer", marginRight: '1rem' }}
                                onClick={() => editarRole(user.idUtilizador)}
                                title="Confirmar Edição"
                              />
                              <FaTimes
                                className="text-warning"
                                style={{ cursor: "pointer", marginRight: '1rem' }}
                                onClick={() => setEditingUserId(null)}
                                title="Cancelar Edição"
                              />
                            </>
                          ) : (
                            <FaEdit
                              className="text-primary"
                              style={{ cursor: "pointer", marginRight: '1rem' }}
                              onClick={() => {
                                setEditingUserId(user.idUtilizador);
                                setNewRole(user.tipoUtilizador?.nome);
                              }}
                              title="Editar Role"
                            />
                          )}

                          {user.estadoConta === "Ativo" ? (
                            <FaBan
                              className="text-danger"
                              style={{ cursor: "pointer" }}
                              onClick={() => bloquearConta(user.idUtilizador)}
                              title="Bloquear Conta"
                            />
                          ) : (
                            <FaUnlock
                              className="text-success"
                              style={{ cursor: "pointer" }}
                              onClick={() => desbloquearConta(user.idUtilizador)}
                              title="Desbloquear Conta"
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="d-flex justify-content-center align-items-center mt-3 text-white">
                  <span
                    className="mx-3"
                    style={{ cursor: currentPage > 1 ? "pointer" : "default", opacity: currentPage > 1 ? 1 : 0.5 }}
                    onClick={prevPage}
                  >
                    &lt;
                  </span>
                  <span style={{ opacity: '0.8' }}>Página {currentPage}</span>
                  <span
                    className="mx-3"
                    style={{
                      cursor: currentPage < Math.ceil(filteredUsers.length / usersPerPage) ? "pointer" : "default",
                      opacity: currentPage < Math.ceil(filteredUsers.length / usersPerPage) ? 1 : 0.5,
                    }}
                    onClick={nextPage}
                  >
                    &gt;
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
