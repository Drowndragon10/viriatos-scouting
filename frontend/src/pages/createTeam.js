import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/sidebar';

const AddTeam = () => {
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('');
  const [county, setCounty] = useState('');
  const [ageCategories, setAgeCategories] = useState([]);
  const [teamTypes, setTeamTypes] = useState([]);
  const [users, setUsers] = useState([]);
  const [idAgeCategory, setIdAgeCategory] = useState('');
  const [idTeamType, setIdTeamType] = useState('');
  const [idUser, setIdUser] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch age categories
        const ageCatRes = await axios.get(`${apiUrl}/ageCategories`, config);
        setAgeCategories(ageCatRes.data);

        // Fetch team types
        const teamTypeRes = await axios.get(`${apiUrl}/teamTypes`, config);
        setTeamTypes(teamTypeRes.data);

        // Fetch all users (trainers)
        const usersRes = await axios.get(`${apiUrl}/auth/users`, config);
        const trainers = usersRes.data.filter(user => user.idUserType === 2);
        setUsers(trainers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [apiUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.post(
        `${apiUrl}/teams`,
        {
          name,
          county,
          district,
          idAgeCategory: Number(idAgeCategory),
          idTeamType: Number(idTeamType),
          idUser: Number(idUser),
        },
        config
      );

      // Reset fields
      setName('');
      setDistrict('');
      setCounty('');
      setIdAgeCategory('');
      setIdTeamType('');
      setIdUser('');
    } catch (error) {
      console.error('Error adding team:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', backgroundColor: '#2C2C2C' }}>
      <Sidebar />
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', padding: '20px', flex: 1 }}>
        <div className="card mt-5" style={{ width: '100%', maxWidth: '600px', backgroundColor: '#2C2C2C', border: 'none' }}>
          <h2 className="card-title text-center mb-5" style={{ color: 'white' }}>Add Team</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Team Name"
                required
                style={{ backgroundColor: '#121212', opacity: '0.4', border: 'none', color: 'white' }}
              />
            </div>
            <div className="mb-3">
              <select
                className="form-select"
                value={idAgeCategory}
                onChange={(e) => setIdAgeCategory(e.target.value)}
                required
                style={{ backgroundColor: '#121212', opacity: '0.4', border: 'none', color: 'white' }}
              >
                <option value="">Select Age Category</option>
                {ageCategories.map(cat => (
                  <option key={cat.idAgeCategory} value={cat.idAgeCategory}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <select
                className="form-select"
                value={idTeamType}
                onChange={(e) => setIdTeamType(e.target.value)}
                required
                style={{ backgroundColor: '#121212', opacity: '0.4', border: 'none', color: 'white' }}
              >
                <option value="">Select Team Type</option>
                {teamTypes.map(type => (
                  <option key={type.idTeamType} value={type.idTeamType}>{type.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <select
                className="form-select"
                value={idUser}
                onChange={(e) => setIdUser(e.target.value)}
                required
                style={{ backgroundColor: '#121212', opacity: '0.4', border: 'none', color: 'white' }}
              >
                <option value="">Select Trainer</option>
                {users.map(user => (
                  <option key={user.idUser} value={user.idUser}>{user.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                placeholder="County"
                style={{ backgroundColor: '#121212', opacity: '0.4', border: 'none', color: 'white' }}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="District"
                style={{ backgroundColor: '#121212', opacity: '0.4', border: 'none', color: 'white' }}
              />
            </div>
            <div className="d-grid gap-2">
              <button
                type="submit"
                className="btn w-100"
                style={{ backgroundColor: 'black', color: 'white' }}
                disabled={isLoading}
              >
                {isLoading ? 'Adding...' : 'Add Team'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTeam;
