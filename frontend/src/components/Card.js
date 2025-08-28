import React from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { getUserRoleFromToken } from "../components/jwtDecode";

const Card = ({ nome, descricao, onEdit, onDelete, children, onClick }) => {
  const idUserType = getUserRoleFromToken();

  return (
    <div 
      className="card text-white mb-3" 
      style={{ 
        width: "18rem", 
        backgroundColor: '#121212', 
        position: "relative", 
        cursor: "pointer" 
      }} 
      onClick={onClick} // Clique do cartão
    >
      {idUserType === 1 && (
        <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "10px" }}>
          <button
            className="btn btn-transparent p-1"
            onClick={(event) => {
              event.stopPropagation();
              onEdit();
            }}
            style={{ color: "white" }}
          >
            <FaPencilAlt style={{ fontSize: "1.2rem" }} />
          </button>
          <button
            className="btn btn-transparent p-1"
            onClick={(event) => {
              event.stopPropagation(); 
              onDelete();
            }}
            style={{ color: "white" }}
          >
            <FaTrash style={{ fontSize: "1.2rem" }} />
          </button>
        </div>
      )}
      <div className="card-body" style={{ textAlign: "left", padding: "15px" }}>
        <span style={{ fontSize: "0.8rem", color: "white", display: "block", marginBottom: "5px", opacity: 0.5 }}>
          NOME
        </span>
        <h5 className="card-title" style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
          {nome}
        </h5>
        <p className="card-text" style={{ fontSize: "1rem", color: "white" }}>
          {descricao}
        </p>
        <div className="d-flex justify-content-center align-items-center mt-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Card;
