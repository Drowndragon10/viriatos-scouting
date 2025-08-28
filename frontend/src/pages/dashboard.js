import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBan, FaUnlock, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Sidebar from "../components/sidebar";

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

      setUsers(response.data?.users || []);
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
      setUsers([]);
    }
  }, [apiUrl, token]);

  const carregarTipos = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/userTypes/`, {
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

  const atualizarEstadoUsuario = (idUser, newAccountStatus) => {
    setUsers(users.map(user =>
      user.idUser === idUser
        ? { ...user, accountStatus: newAccountStatus }
        : user
    ));
  };

  const editarRole = async (idUser) => {
    try {
      await axios.put(
        `${apiUrl}/admin/users/updateRole/${idUser}`,
        { userType: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Tipo de utilizador atualizado com sucesso");
      setUsers(users.map(user =>
        user.idUser === idUser
          ? { ...user, userType: { name: newRole } }
          : user
      ));
      setEditingUserId(null);
    } catch (error) {
      console.error("Erro ao atualizar tipo de utilizador:", error);
    }
  };

  const bloquearConta = async (idUser) => {
    try {
      await axios.put(
        `${apiUrl}/admin/users/block/${idUser}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Conta bloqueada com sucesso");
      atualizarEstadoUsuario(idUser, "Inativo");
    } catch (error) {
      console.error("Erro ao bloquear conta:", error);
    }
  };

  const desbloquearConta = async (idUser) => {
    try {
      await axios.put(
        `${apiUrl}/admin/users/unblock/${idUser}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Conta desbloqueada com sucesso");
      atualizarEstadoUsuario(idUser, "Ativo");
    } catch (error) {
      console.error("Erro ao desbloquear conta:", error);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterRole === "" || user.userType?.name === filterRole) &&
        (filterState === "" || user.accountStatus === filterState)
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
      <Sidebar />
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
                  <option key={type.idUserType} value={type.name}>
                    {type.name}
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
                <table className="table-custom">
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
                      <tr key={user.idUser}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          {editingUserId === user.idUser ? (
                            <select
                              value={newRole}
                              onChange={(e) => setNewRole(e.target.value)}
                              className="form-select"
                            >
                              {types.map((type) => (
                                <option key={type.idUserType} value={type.name}>
                                  {type.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            user.userType?.name
                          )}
                        </td>
                        <td>{user.accountStatus}</td>
                        <td>
                          {editingUserId === user.idUser ? (
                            <>
                              <FaCheck
                                className="text-success"
                                style={{ cursor: "pointer", marginRight: "1rem" }}
                                onClick={() => editarRole(user.idUser)}
                              />
                              <FaTimes
                                className="text-warning"
                                style={{ cursor: "pointer", marginRight: "1rem" }}
                                onClick={() => setEditingUserId(null)}
                              />
                            </>
                          ) : (
                            <FaEdit
                              className="text-primary"
                              style={{ cursor: "pointer", marginRight: "1rem" }}
                              onClick={() => {
                                setEditingUserId(user.idUser);
                                setNewRole(user.userType?.name);
                              }}
                            />
                          )}

                          {user.accountStatus === "Ativo" ? (
                            <FaBan
                              className="text-danger"
                              style={{ cursor: "pointer" }}
                              onClick={() => bloquearConta(user.idUser)}
                            />
                          ) : (
                            <FaUnlock
                              className="text-success"
                              style={{ cursor: "pointer" }}
                              onClick={() => desbloquearConta(user.idUser)}
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
