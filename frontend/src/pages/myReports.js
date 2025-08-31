import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar";
import { getUserIdFromToken } from "../components/jwtDecode";

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [expandedReportId, setExpandedReportId] = useState(null);
  const apiUrl = process.env.REACT_APP_BACKEND_URL;
  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${apiUrl}/reports/user/${userId}`, config);
        setReports(response.data);
      } catch (error) {
        console.error("Erro ao buscar relatórios:", error);
      }
    };

    fetchReports();
  }, [apiUrl, userId]);

  return (
    <div style={{ display: "flex", backgroundColor: "#121212", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <div className="mt-5" style={{ flex: 1, overflowY: "auto" }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 className="mb-2 text-white">Meus Relatórios</h2>
          <hr />

          {reports.length === 0 ? (
            <p className="text-center text-white" style={{ fontSize: "18px" }}>
              Não foram encontrados relatórios.
            </p>
          ) : (
            <table className="table-custom" style={{ backgroundColor: "#2C2C2C", color: "white" }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Atleta</th>
                  <th>Olheiro</th>
                  <th>Data</th>
                  <th>Estado</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => {
                  const dataFormatada = new Date(report.reportDate).toLocaleDateString();
                  const atletaNome = report.athlete?.name || "N/A";
                  const olheiroNome = report.user?.name || "N/A";

                  return (
                    <React.Fragment key={report.idReport}>
                      <tr>
                        <td>{report.idReport}</td>
                        <td>{atletaNome}</td>
                        <td>{olheiroNome}</td>
                        <td>{dataFormatada}</td>
                        <td>{report.status}</td>
                        <td>
                          <button
                            className="btn"
                            style={{ backgroundColor: "#2C2C2C", color: "white", border: "none", width: "120px" }}
                            onClick={() => setExpandedReportId(expandedReportId === report.idReport ? null : report.idReport)}
                          >
                            Detalhes
                          </button>
                        </td>
                      </tr>

                      {expandedReportId === report.idReport && (
                        <tr style={{ backgroundColor: "#1a1a1a" }}>
                          <td colSpan="6">
                            <div>
                              <p><strong>Técnica:</strong> {report.technique}</p>
                              <p><strong>Velocidade:</strong> {report.speed}</p>
                              <p><strong>Atitude Competitiva:</strong> {report.competitiveAttitude}</p>
                              <p><strong>Inteligência:</strong> {report.intelligence}</p>
                              <p><strong>Altura:</strong> {report.height}</p>
                              <p><strong>Morfologia:</strong> {report.morphology}</p>
                              <p><strong>Rating Final:</strong> {report.finalRating}</p>
                              <p><strong>Texto Livre:</strong> {report.freeText || "N/A"}</p>
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

export default MyReports;
