import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "../components/sidebar";
import { getUserRoleFromToken, getUserIdFromToken } from "../components/jwtDecode";

const RelatoriosSubmetidos = () => {
    const [relatorios, setRelatorios] = useState([]);
    const [utilizadores, setUtilizadores] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const relatoriosPerPage = 5;
    const [filtroAtleta, setFiltroAtleta] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [filtroOlheiro, setFiltroOlheiro] = useState('');
    const [expandedReportId, setExpandedReportId] = useState(null);

    const userRole = getUserRoleFromToken();
    const userId = getUserIdFromToken();
    const apiUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchRelatorios = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                let response;
                if (userRole === 1) {
                    response = await axios.get(`${apiUrl}/reports`, config);
                } else if (userRole === 3) {
                    response = await axios.get(`${apiUrl}/reports/user/${userId}`, config);
                }
                setRelatorios(response.data);

                const usersResponse = await axios.get(`${apiUrl}/auth/users`, config);
                setUtilizadores(usersResponse.data.filter(u => u.idUserType === 3)); // só olheiros
            } catch (err) {
                console.error("Erro ao buscar relatórios:", err);
            }
        };
        fetchRelatorios();
    }, [apiUrl, userRole, userId]);

    const nextPage = () => {
        if (currentPage < Math.ceil(relatorios.length / relatoriosPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const relatoriosFiltrados = relatorios.filter(relatorio => {
        const atletaMatch = filtroAtleta ? relatorio.athlete?.name === filtroAtleta : true;
        const estadoMatch = filtroEstado ? relatorio.status === filtroEstado : true;
        const olheiroMatch = filtroOlheiro ? relatorio.user?.idUser === parseInt(filtroOlheiro) : true;
        return atletaMatch && estadoMatch && olheiroMatch;
    });

    const relatoriosPaginados = relatoriosFiltrados.slice(
        (currentPage - 1) * relatoriosPerPage,
        currentPage * relatoriosPerPage
    );

    const handleAccept = async (idReport) => {
        try {
            const token = localStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${apiUrl}/reports/accept/${idReport}`, {}, config);

            setRelatorios(prev =>
                prev.map(r => r.idReport === idReport ? { ...r, status: "Aprovado" } : r)
            );
        } catch (err) {
            console.error("Erro ao aceitar relatório:", err);
        }
    };

    const handleReject = async (idReport) => {
        try {
            const token = localStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${apiUrl}/reports/reject/${idReport}`, {}, config);

            setRelatorios(prev =>
                prev.map(r => r.idReport === idReport ? { ...r, status: "Rejeitado" } : r)
            );
        } catch (err) {
            console.error("Erro ao rejeitar relatório:", err);
        }
    };

    return (
        <div style={{ display: "flex", backgroundColor: "#121212", height: "100vh", overflow: "hidden" }}>
            <Sidebar />
            <div className="mt-5" style={{ flex: 1, overflowY: 'auto' }}>
                <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    <h2 className="mb-2 text-white">
                        {userRole === 1 ? "Relatórios Submetidos" : "Seus Relatórios Submetidos"}
                    </h2>
                    <hr/>

                    {/* Filtros */}
                    <div className="d-flex justify-content-start mb-4 gap-3">
                        <select
                            className="form-select"
                            style={{ width: '200px', backgroundColor: '#2C2C2C', color: 'white', border: 'none' }}
                            value={filtroAtleta}
                            onChange={(e) => setFiltroAtleta(e.target.value)}
                        >
                            <option value="">Todos os Atletas</option>
                            {Array.from(new Set(relatorios.map(r => r.athlete?.name)))
                                .filter(nome => nome)
                                .map(nome => (
                                    <option key={nome} value={nome}>{nome}</option>
                                ))}
                        </select>

                        <select
                            className="form-select"
                            style={{ width: '200px', backgroundColor: '#2C2C2C', color: 'white', border: 'none' }}
                            value={filtroOlheiro}
                            onChange={(e) => setFiltroOlheiro(e.target.value)}
                        >
                            <option value="">Todos os Olheiros</option>
                            {utilizadores.map(u => (
                                <option key={u.idUser} value={u.idUser}>{u.name}</option>
                            ))}
                        </select>

                        <select
                            className="form-select"
                            style={{ width: '200px', backgroundColor: '#2C2C2C', color: 'white', border: 'none' }}
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                        >
                            <option value="">Todos os Estados</option>
                            <option value="Aprovado">Aprovado</option>
                            <option value="Rejeitado">Rejeitado</option>
                            <option value="Em revisão">Em revisão</option>
                        </select>
                    </div>

                    {/* Tabela */}
                    <div style={{ minHeight: "300px" }}>
                        {relatoriosPaginados.length === 0 ? (
                            <p className="text-center text-white" style={{ fontSize: "18px" }}>Não foram encontrados relatórios.</p>
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
                                    {relatoriosPaginados.map(relatorio => {
                                        const relatorioDataFormatada = new Date(relatorio.reportDate).toLocaleString();
                                        return (
                                            <React.Fragment key={relatorio.idReport}>
                                                <tr>
                                                    <td>{relatorio.idReport}</td>
                                                    <td>{relatorio.athlete?.name || "N/A"}</td>
                                                    <td>{relatorio.user?.name || "N/A"}</td>
                                                    <td>{relatorioDataFormatada}</td>
                                                    <td>{relatorio.status}</td>
                                                    <td>
                                                        <button
                                                            className="btn"
                                                            style={{ backgroundColor: '#2C2C2C', width: '100px', border: 'none', color: 'white' }}
                                                            onClick={() => setExpandedReportId(expandedReportId === relatorio.idReport ? null : relatorio.idReport)}
                                                        >
                                                            Detalhes
                                                        </button>
                                                    </td>
                                                </tr>

                                                {expandedReportId === relatorio.idReport && (
                                                    <tr style={{ backgroundColor: "#1a1a1a" }}>
                                                        <td colSpan="6">
                                                            <div>
                                                                <p><strong>Técnica:</strong> {relatorio.technique}</p>
                                                                <p><strong>Velocidade:</strong> {relatorio.speed}</p>
                                                                <p><strong>Atitude Competitiva:</strong> {relatorio.competitiveAttitude}</p>
                                                                <p><strong>Inteligência:</strong> {relatorio.intelligence}</p>
                                                                <p><strong>Altura:</strong> {relatorio.height}</p>
                                                                <p><strong>Morfologia:</strong> {relatorio.morphology}</p>
                                                                <p><strong>Rating Final:</strong> {relatorio.finalRating}</p>
                                                                <p><strong>Texto Livre:</strong> {relatorio.freeText || "N/A"}</p>

                                                                {/* Botões de Aprovar/Rejeitar */}
                                                                {userRole === 1 && (
                                                                    <div className="d-flex gap-2 mt-2">
                                                                        <button
                                                                            className="btn btn-success"
                                                                            style={{ flex: 1 }}
                                                                            onClick={() => handleAccept(relatorio.idReport)}
                                                                        >
                                                                            Aceitar
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-danger"
                                                                            style={{ flex: 1 }}
                                                                            onClick={() => handleReject(relatorio.idReport)}
                                                                        >
                                                                            Rejeitar
                                                                        </button>
                                                                    </div>
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

                        {/* Paginação */}
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
                                style={{ cursor: currentPage < Math.ceil(relatoriosFiltrados.length / relatoriosPerPage) ? "pointer" : "default", opacity: currentPage < Math.ceil(relatoriosFiltrados.length / relatoriosPerPage) ? 1 : 0.5 }}
                                onClick={nextPage}
                            >
                                &gt;
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RelatoriosSubmetidos;
