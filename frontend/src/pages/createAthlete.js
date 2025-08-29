import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/sidebar';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import pt from 'date-fns/locale/pt';
import "react-datepicker/dist/react-datepicker.css";

registerLocale('pt', pt);

const CreateAthlete = () => {
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState(null);
    const [nationality, setNationality] = useState('');
    const [birthplace, setBirthplace] = useState('');
    const [idPosition, setIdPosition] = useState('');
    const [idGuardian, setIdGuardian] = useState('');
    const [idTeam, setIdTeam] = useState('');
    const [link, setLink] = useState('');
    const [positions, setPositions] = useState([]);
    const [teams, setTeams] = useState([]);
    const [guardians, setGuardians] = useState([]);
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const positionsRes = await axios.get(`${apiUrl}/positions`, config);
                const teamsRes = await axios.get(`${apiUrl}/teams`, config);
                const guardiansRes = await axios.get(`${apiUrl}/guardians`, config);

                setPositions(positionsRes.data);
                setTeams(teamsRes.data);

                if (guardiansRes.data?.guardians) {
                    setGuardians(guardiansRes.data.guardians);
                } else {
                    setGuardians(guardiansRes.data);
                }

            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            }
        };
        fetchData();
    }, [apiUrl]);

    const handleAddAtleta = async (e) => {
        e.preventDefault();

        const atleta = {
            name,
            birthDate,
            nationality,
            birthplace,
            idPosition: parseInt(idPosition, 10),
            idGuardian: parseInt(idGuardian, 10),
            idTeam: parseInt(idTeam, 10),
            link
        };

        try {
            const token = localStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(`${apiUrl}/athletes`, atleta, config);

            // Limpar campos
            setName('');
            setBirthDate(null);
            setNationality('');
            setBirthplace('');
            setIdPosition('');
            setIdGuardian('');
            setIdTeam('');
            setLink('');

            navigate('/athletes'); // Voltar para a lista de atletas
        } catch (error) {
            console.error("Erro ao criar atleta:", error);
        }
    };

    return (
        <div className="d-flex" style={{ backgroundColor: "#121212", minHeight: "100vh" }}>
            <Sidebar />
            <div className="container mt-4" style={{ maxWidth: '600px', padding: '20px' }}>
                <h2 className="text-white mb-4">Adicionar Novo Atleta</h2>
                <form onSubmit={handleAddAtleta}>
                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                        placeholder="Nome do Atleta" required
                        className="form-control mb-3" style={{ backgroundColor: '#2C2C2C', color: 'white', border: 'none' }} />

                    <DatePicker
                        selected={birthDate}
                        onChange={setBirthDate}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Data de Nascimento"
                        showYearDropdown
                        scrollableYearDropdown
                        customInput={
                            <input
                                style={{
                                    backgroundColor: '#2C2C2C',
                                    color: 'white',
                                    border: 'none',
                                }}
                                className="form-control mb-3"
                            />
                        }
                    />

                    <input type="text" value={nationality} onChange={e => setNationality(e.target.value)}
                        placeholder="Nacionalidade" required
                        className="form-control mb-3" style={{ backgroundColor: '#2C2C2C', color: 'white', border: 'none' }} />

                    <input type="text" value={birthplace} onChange={e => setBirthplace(e.target.value)}
                        placeholder="Naturalidade" required
                        className="form-control mb-3" style={{ backgroundColor: '#2C2C2C', color: 'white', border: 'none' }} />

                    <select value={idPosition} onChange={e => setIdPosition(e.target.value)}
                        className="form-select mb-3" style={{ backgroundColor: '#2C2C2C', color: 'white', border: 'none' }}>
                        <option value="">Selecione uma posição</option>
                        {positions.map(pos => <option key={pos.idPosition} value={pos.idPosition}>{pos.name || pos.nome}</option>)}
                    </select>

                    <select value={idGuardian} onChange={e => setIdGuardian(e.target.value)}
                        className="form-select mb-2" style={{ backgroundColor: '#2C2C2C', color: 'white', border: 'none' }}>
                        <option value="">Selecione um encarregado</option>
                        {guardians.map(g => (
                            <option key={g.idGuardian} value={g.idGuardian}>
                                {g.name || g.nome}
                            </option>
                        ))}
                    </select>

                    <div className="mb-3">
                        <a
                            href="/guardian/create"
                            style={{ color: 'white', textDecoration: 'underline', cursor: 'pointer' }}
                        >
                            Ainda não tem encarregado? Registe aqui!
                        </a>
                    </div>

                    <select value={idTeam} onChange={e => setIdTeam(e.target.value)}
                        className="form-select mb-3" style={{ backgroundColor: '#2C2C2C', color: 'white', border: 'none' }}>
                        <option value="">Selecione uma equipa</option>
                        {teams.map(t => <option key={t.idTeam} value={t.idTeam}>{t.name || t.nome}</option>)}
                    </select>

                    <input type="text" value={link} onChange={e => setLink(e.target.value)}
                        placeholder="Link (opcional)"
                        className="form-control mb-3" style={{ backgroundColor: '#2C2C2C', color: 'white', border: 'none' }} />

                    <button type="submit" className="btn btn-primary w-100">
                        Adicionar Atleta
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateAthlete;
