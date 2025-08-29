import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTimes, FaCheck } from "react-icons/fa";

const AgeCategoriesPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  // Buscar categorias
  const carregarCategorias = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/ageCategories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategorias(response.data || []);
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
      setError("Erro ao carregar as categorias etárias.");
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token]);

  useEffect(() => {
    carregarCategorias();
  }, [carregarCategorias]);

  // Criar nova
  const handleAdd = () => navigate("/ageCategorie/create");

  // Eliminar
  const handleDelete = async (idCategory) => {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) return;
    try {
      await axios.delete(`${apiUrl}/ageCategories/${idCategory}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategorias((prev) => prev.filter((c) => c.idCategory !== idCategory));
    } catch (err) {
      console.error("Erro ao apagar categoria:", err.response?.data || err.message);
      alert("Erro ao apagar categoria: " + (err.response?.data?.message || err.message));
    }
  };

  // Iniciar edição
  const startEdit = (categoria) => {
    setEditingCategoryId(categoria.idCategory);
    setEditedName(categoria.name);
  };

  // Cancelar edição
  const cancelEdit = () => {
    setEditingCategoryId(null);
    setEditedName("");
  };

  // Guardar edição
  const saveEdit = async () => {
    if (!editingCategoryId) return;
    
    try {
      const response = await axios.put(
        `${apiUrl}/ageCategories/${editingCategoryId}`,
        { name: editedName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      console.log("Resposta da API:", response.data);
      
      // Atualizar o estado local
      setCategorias((prev) =>
        prev.map((c) =>
          c.idCategory === editingCategoryId ? { ...c, name: editedName } : c
        )
      );
      
      setEditingCategoryId(null);
      setEditedName("");
    } catch (err) {
      console.error("Erro completo ao atualizar categoria:", err);
      console.error("Detalhes do erro:", err.response?.data);
      alert("Erro ao atualizar categoria: " + (err.response?.data?.message || err.message));
    }
  };

  // Filtrar categorias
  const filteredCategorias = useMemo(() => {
    return categorias.filter((categoria) =>
      categoria.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categorias, searchTerm]);

  if (loading) return <div style={{textAlign: "center", padding: "40px 0", color: "white"}}>Carregando...</div>;
  if (error) return <div style={{textAlign: "center", padding: "40px 0", color: "white"}}>{error}</div>;

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#121212",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <Sidebar />
      <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ color: "white", marginBottom: "16px" }}>Categorias Etárias</h2>
          <hr style={{ borderColor: "#444" }} />
          
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "10px"
          }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por nome"
              style={{
                backgroundColor: "#2C2C2C",
                width: "300px",
                border: "none",
                color: "white",
                padding: "10px",
                borderRadius: "4px"
              }}
            />
            <button
              onClick={handleAdd}
              style={{
                backgroundColor: "#2C2C2C",
                color: "#ffffff",
                borderRadius: "10px",
                padding: "10px 20px",
                border: "none",
                cursor: "pointer"
              }}
            >
              + Criar Categoria Etária
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ 
              width: "100%", 
              borderCollapse: "collapse",
            }}>
              <thead>
                <tr style={{ backgroundColor: "#FDD522", color: "#000" }}>
                  <th style={{ padding: "12px", textAlign: "left" }}>Nome</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategorias.length === 0 ? (
                  <tr key="no-data">
                    <td
                      colSpan="2"
                      style={{ 
                        textAlign: "center", 
                        color: "white", 
                        padding: "20px",
                        backgroundColor: "#2C2C2C" 
                      }}
                    >
                      {categorias.length === 0 ? "Nenhuma categoria disponível." : "Nenhuma categoria encontrada."}
                    </td>
                  </tr>
                ) : (
                  filteredCategorias.map((categoria) => (
                    <tr
                      key={categoria.idCategory}
                      style={{ 
                        backgroundColor: "#2C2C2C", 
                        color: "#fff",
                        borderBottom: "1px solid #444"
                      }}
                    >
                      <td style={{ padding: "12px" }}>
                        {editingCategoryId === categoria.idCategory ? (
                          <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            style={{
                              backgroundColor: "#3C3C3C",
                              color: "white",
                              border: "1px solid #555",
                              padding: "8px",
                              borderRadius: "4px",
                              width: "100%"
                            }}
                            autoFocus
                          />
                        ) : (
                          categoria.name
                        )}
                      </td>
                      <td style={{ padding: "12px" }}>
                        {editingCategoryId === categoria.idCategory ? (
                          <>
                            <FaCheck
                              style={{ 
                                cursor: "pointer", 
                                marginRight: "1rem",
                                fontSize: "18px",
                                color: "green"
                              }}
                              onClick={saveEdit}
                            />
                            <FaTimes
                              style={{ 
                                cursor: "pointer", 
                                marginRight: "1rem",
                                fontSize: "18px",
                                color: "orange"
                              }}
                              onClick={cancelEdit}
                            />
                          </>
                        ) : (
                          <>
                            <FaEdit
                              style={{ 
                                cursor: "pointer", 
                                marginRight: "1rem",
                                fontSize: "18px" 
                              }}
                              onClick={() => startEdit(categoria)}
                            />
                            <FaTimes
                              style={{ 
                                cursor: "pointer",
                                fontSize: "18px",
                                color: "red"
                              }}
                              onClick={() => handleDelete(categoria.idCategory)}
                            />
                          </>
                        )}
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