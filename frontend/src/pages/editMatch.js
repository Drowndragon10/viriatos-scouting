import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/sidebar';
import { useParams } from 'react-router-dom';

const EditMatch = () => {
    const { idMatch } = useParams();
    const apiUrl = process.env.REACT_APP_BACKEND_URL;
    const [teams, setTeams] = useState([]);
    const [county, setCounty] = useState('');
    const [district, setDistrict] = useState('');
    const [homeTeam, setHomeTeam] = useState('');
    const [awayTeam, setAwayTeam] = useState('');
    const [matchDate, setMatchDate] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    setError('Invalid or expired authentication token.');
                    return;
                }
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get(`${apiUrl}/teams`, config);
                setTeams(response.data);
            } catch (err) {
                console.error('Error loading teams:', err);
                setError('Failed to load available teams.');
            }
        };

        const fetchMatch = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    setError('Invalid or expired authentication token.');
                    return;
                }
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get(`${apiUrl}/matches/${idMatch}`, config);

                const { district, county, matchDate, teams: teamsData } = response.data;

                const home = teamsData?.find(t => t.role === 'casa')?.idTeam || '';
                const away = teamsData?.find(t => t.role === 'visitante')?.idTeam || '';

                setCounty(county || '');
                setDistrict(district || '');
                setMatchDate(matchDate || '');
                setHomeTeam(home);
                setAwayTeam(away);
            } catch (err) {
                console.error('Error loading match:', err);
                setError('Failed to load match data.');
            }
        };


        fetchTeams();
        fetchMatch();
    }, [idMatch, apiUrl]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'county') setCounty(value);
        if (name === 'district') setDistrict(value);
        if (name === 'matchDate') setMatchDate(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (homeTeam === awayTeam) {
            setError('Home and away teams cannot be the same.');
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('Invalid or expired authentication token.');
                return;
            }
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const data = {
                county,
                district,
                matchDate,
                teams: [
                    { idTeam: homeTeam, role: 'casa' },
                    { idTeam: awayTeam, role: 'visitante' },
                ],
            };

            await axios.put(`${apiUrl}/matches/${idMatch}`, data, config);
            setMessage('Match successfully updated!');
        } catch (err) {
            console.error('Error updating match:', err);
            setError('Failed to update match. Please try again.');
        }
    };

    return (
        <div style={{ display: 'flex', backgroundColor: '#2C2C2C' }}>
            <Sidebar />
            <div style={{ display: 'flex', flexDirection: 'column', padding: '20px', flex: 1, alignItems: 'center' }}>
                <div className="card" style={{ maxWidth: '600px', width: '100%', backgroundColor: '#2C2C2C', border: 'none', padding: '20px' }}>
                    <h2 className="card-title text-center mb-4" style={{ color: 'white' }}>Edit Match</h2>

                    {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input
                                type="datetime-local"
                                name="matchDate"
                                value={matchDate}
                                onChange={handleChange}
                                className="form-control"
                                required
                                style={{ backgroundColor: '#121212', opacity: 0.4, border: 'none', color: 'white', marginBottom: '10px' }}
                            />
                            <input
                                type="text"
                                name="county"
                                value={county}
                                onChange={handleChange}
                                placeholder="County"
                                className="form-control"
                                required
                                style={{ backgroundColor: '#121212', opacity: 0.4, border: 'none', color: 'white', marginBottom: '10px', width: '100%'}}
                            />
                            <input
                                type="text"
                                name="district"
                                value={district}
                                onChange={handleChange}
                                placeholder="District"
                                className="form-control"

                                required
                                style={{ backgroundColor: '#121212', opacity: 0.4, border: 'none', color: 'white', width: '100%', marginBottom: '10px'}}
                            />
                            <select
                                value={homeTeam}
                                onChange={(e) => setHomeTeam(e.target.value)}
                                required
                                className="form-control"

                                style={{ backgroundColor: '#121212', opacity: 0.4, border: 'none', color: 'white', marginBottom: '10px', width: '100%'}}
                            >
                                <option value="" disabled>Home Team</option>
                                {teams.map(t => (
                                    <option key={t.idTeam} value={t.idTeam}>{t.name}</option>
                                ))}
                            </select>
                            <select
                                value={awayTeam}
                                onChange={(e) => setAwayTeam(e.target.value)}
                                required
                                className="form-control"

                                style={{ backgroundColor: '#121212', opacity: 0.4, border: 'none', color: 'white', width: '100%'}}
                            >
                                <option value="" disabled>Away Team</option>
                                {teams.map(t => (
                                    <option key={t.idTeam} value={t.idTeam}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className="btn w-100" style={{ backgroundColor: 'black', color: 'white'}}>
                            Edit Match
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditMatch;
