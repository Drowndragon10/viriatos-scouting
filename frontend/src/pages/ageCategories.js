import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTimes, FaCheck } from "react-icons/fa";

const AgeCategoriesPage = () => {
  const [ageCategories, setAgeCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  // 🔹 Buscar categorias
  useEffect(() => {
    const fetchAgeCategories = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${apiUrl}/ageCategories/`, config);
        setAgeCategories(response.data);
      } catch (err) {
        setError("Erro ao carregar categorias de idade.");
      }
    };
    fetchAgeCategories();
  }, [apiUrl]);

  // 🔹 Criar nova categoria
  const handleAdd = () => navigate("/ageCategory/create");

  // 🔹 Eliminar categoria
  const handleDelete = async (idAgeCategory) => {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      setMensagem("A exclusão foi cancelada.");
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${apiUrl}/ageCategories/${idAgeCategory}`, config);
      setAgeCategories(ageCategories.filter((c) => c.idAgeCategory !== idAgeCategory));
      setMensagem("Categoria eliminada com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir categoria:", err);
      setMensagem("Erro ao excluir a categoria.");
    }
  };

  // 🔹 Editar categoria
  const handleEdit = (categoria) => {
    setEditingId(categoria.idAgeCategory);
    setNewName(categoria.name);
  };

  const saveEdit = async (idAgeCategory) => {
    try {
      const token = localStorage.getItem("authToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${apiUrl}/ageCategories/${idAgeCategory}`, { name: newName }, config);
      setAgeCategories(
        ageCategories.map((c) =>
          c.idAgeCategory === idAgeCategory ? { ...c, name: newName } : c
        )
      );
      setEditingId(null);
      setMensagem("Categoria atualizada com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar categoria:", err);
      setMensagem("Erro ao atualizar categoria.");
    }
  };

  // 🔹 Filtrar pesquisa
  const filteredCategories = ageCategories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) return <div className="text-center py-10">{error}</div>;

  return (
    <div
      style={{ display: "flex", backgroundColor: "#121212", height: "100vh", overflow: "hidden" }}
    >
      <Sidebar />
      <div className="mt-5" style={{ flex: 1, overflowY: "auto" }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 className="mb-2 text-white">Categorias de Idade</h2>
          <hr />
          <div className="d-flex justify-content-between mb-3">
            <input
              type="text"
              placeholder="Pesquisar por nome"
              className="form-control"
              style={{ backgroundColor: "#2C2C2C", width: "300px", border: "none", color: "white" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={handleAdd}
              className="btn"
              style={{
                backgroundColor: "#2C2C2C",
                color: "#ffffff",
                borderRadius: "10px",
                padding: "7px 20px",
              }}
            >
              + Criar Categoria
            </button>
          </div>

          {mensagem && <p className="text-white mb-3">{mensagem}</p>}

          <div className="table-responsive">
            <table className="table-custom">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="text-center text-white">
                      Nenhuma categoria encontrada.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((categoria) => (
                    <tr key={categoria.idAgeCategory}>
                      <td>
                        {editingId === categoria.idAgeCategory ? (
                          <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="form-control"
                          />
                        ) : (
                          categoria.name
                        )}
                      </td>
                      <td>
                        {editingId === categoria.idAgeCategory ? (
                          <>
                            <FaCheck
                              className="text-success"
                              style={{ cursor: "pointer", marginRight: "1rem" }}
                              onClick={() => saveEdit(categoria.idAgeCategory)}
                            />
                            <FaTimes
                              className="text-warning"
                              style={{ cursor: "pointer", marginRight: "1rem" }}
                              onClick={() => setEditingId(null)}
                            />
                          </>
                        ) : (
                          <FaEdit
                            style={{ cursor: "pointer", marginRight: "1rem" }}
                            onClick={() => handleEdit(categoria)}
                          />
                        )}
                        <FaTimes
                          className="text-danger"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDelete(categoria.idAgeCategory)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgeCategoriesPage;
