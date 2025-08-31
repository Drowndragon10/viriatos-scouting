import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar";
import { FaEdit, FaTimes, FaCheck } from "react-icons/fa";

const AgeCategoriesPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");

  // 🔹 Buscar categorias
  useEffect(() => {
    const api = axios.create({
      baseURL: "https://pi4-3soq.onrender.com",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const fetchCategorias = async () => {
      try {
        const res = await api.get("/ageCategories");
        setCategorias(res.data);
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
        setError("Erro ao carregar categorias");
      }
    };

    fetchCategorias();
  }, []);

  // 🔹 Editar categoria
  const handleEdit = (categoria) => {
    setEditingId(categoria.idAgeCategory);
    setNewName(categoria.name);
  };

  const saveEdit = async (id) => {
    try {
      const api = axios.create({
        baseURL: "https://pi4-3soq.onrender.com",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      await api.put(`/ageCategories/${id}`, { name: newName });

      setCategorias(
        categorias.map((c) =>
          c.idAgeCategory === id ? { ...c, name: newName } : c
        )
      );
      setEditingId(null);
    } catch (err) {
      console.error("Erro completo ao atualizar categoria:", err);
      setError("Erro ao atualizar categoria");
    }
  };

  const deleteCategoria = async (id) => {
    try {
      const api = axios.create({
        baseURL: "https://pi4-3soq.onrender.com",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      await api.delete(`/ageCategories/${id}`);
      setCategorias(categorias.filter((c) => c.idAgeCategory !== id));
    } catch (err) {
      console.error("Erro completo ao apagar categoria:", err);
      setError("Erro ao apagar categoria");
    }
  };

  // 🔹 Filtrar pesquisa
  const filteredCategorias = categorias.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Categorias de Idade</h1>

        <input
          type="text"
          placeholder="Pesquisar..."
          className="border px-2 py-1 mb-4 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {error && <p className="text-red-500">{error}</p>}

        <ul>
          {filteredCategorias.map((categoria) => (
            <li
              key={categoria.idAgeCategory}
              className="flex items-center justify-between border-b py-2"
            >
              {editingId === categoria.idAgeCategory ? (
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="border px-2 py-1 flex-1"
                  />
                  <button
                    onClick={() => saveEdit(categoria.idAgeCategory)}
                    className="text-green-600"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-red-600"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <span>{categoria.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(categoria)}
                      className="text-blue-600"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteCategoria(categoria.idAgeCategory)}
                      className="text-red-600"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AgeCategoriesPage;
