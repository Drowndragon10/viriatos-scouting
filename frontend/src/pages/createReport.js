import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getUserIdFromToken } from '../components/jwtDecode';
import Sidebar from '../components/sidebar';

const CreateReport = () => {
  const { idAthlete } = useParams();
  const apiUrl = process.env.REACT_APP_BACKEND_URL;
  const [reportExists, setReportExists] = useState(false);

  const [formData, setFormData] = useState({
    technique: 0,
    speed: 0,
    competitiveAttitude: 0,
    intelligence: 0,
    height: 'Baixo',
    morphology: 'Ectomorfo',
    finalRating: 0,
    freeText: '',
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`${apiUrl}/reports/${idAthlete}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        if (response.data) {
          setReportExists(true);
        }
      } catch (error) {
        console.log('Sem relatório existente para este atleta.');
      }
    };

    fetchReport();
  }, [apiUrl, idAthlete]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleIncrement = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: Math.min(prevData[field] + 1, 4),
    }));
  };

  const handleDecrement = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: Math.max(prevData[field] - 1, 0),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const idUser = getUserIdFromToken();
    if (!idUser) {
      console.error('ID do utilizador não encontrado!');
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        idUser,
      };

      await axios.post(`${apiUrl}/reports/${idAthlete}`, dataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      console.log('Relatório criado com sucesso');
    } catch (error) {
      console.error('Erro ao criar relatório:', error.response?.data || error.message);
    }
  };

  return (
    <div style={{ display: 'flex', backgroundColor: '#2C2C2C', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ display: 'flex', overflowY: 'auto', alignItems: 'center', flexDirection: 'column', padding: '20px', flex: 1 }}>
        <form onSubmit={handleSubmit} className="row g-3 mt-3" style={{ width: '100%', maxWidth: '1200px', backgroundColor: '#2C2C2C', border: 'none' }}>
          <h2 className="text-center text-light mb-3">Avaliações de jogador</h2>

          {renderCard('Técnica', 'technique', formData.technique, handleIncrement, handleDecrement)}
          {renderCard('Velocidade', 'speed', formData.speed, handleIncrement, handleDecrement)}
          {renderCard('Atitude Competitiva', 'competitiveAttitude', formData.competitiveAttitude, handleIncrement, handleDecrement)}
          {renderCard('Inteligência', 'intelligence', formData.intelligence, handleIncrement, handleDecrement)}

          <div className="col-md-6">
            <div className="card text-light p-3" style={{ backgroundColor: '#121212' }}>
              <label className="form-label">Altura</label>
              <select
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="form-select"
                style={{ backgroundColor: '#2C2C2C', color: 'white', border: 'none' }}
              >
                <option value="Baixo">Baixo</option>
                <option value="Médio">Médio</option>
                <option value="Alto">Alto</option>
              </select>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card text-light p-3" style={{ backgroundColor: '#121212' }}>
              <label className="form-label">Morfologia</label>
              <select
                name="morphology"
                value={formData.morphology}
                onChange={handleChange}
                className="form-select"
                style={{ backgroundColor: '#2C2C2C', color: 'white', border: 'none' }}
              >
                <option value="Ectomorfo">Ectomorfo</option>
                <option value="Mesomorfo">Mesomorfo</option>
                <option value="Endomorfo">Endomorfo</option>
              </select>
            </div>
          </div>

          {renderCard('Rating Final', 'finalRating', formData.finalRating, handleIncrement, handleDecrement)}

          <div className="col-md-12">
            <div className="card text-light p-3" style={{ backgroundColor: '#121212' }}>
              <label className="form-label">Texto Livre</label>
              <textarea
                name="freeText"
                value={formData.freeText}
                onChange={handleChange}
                className="form-control"
                rows="2"
                style={{ backgroundColor: '#2C2C2C', color: 'white', border: 'none' }}
              />
            </div>
          </div>

          <div className="col-md-12 text-center mt-5">
            <button
              type="submit"
              className="btn mb-5"
              style={{
                backgroundColor: reportExists ? 'gray' : '#000',
                color: 'white',
                padding: '10px 15px',
                border: 'none',
                cursor: reportExists ? 'not-allowed' : 'pointer',
                borderRadius: '5px',
                width: '600px',
              }}
              disabled={reportExists}
            >
              {reportExists ? 'Relatório já existente' : 'Submeter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const renderCard = (label, field, value, increment, decrement) => (
  <div className="col-md-6">
    <div className="card text-light p-3" style={{ backgroundColor: '#121212' }}>
      <label className="form-label">{label}</label>
      <div className="d-flex align-items-center">
        <button
          type="button"
          className="btn me-2"
          style={{ backgroundColor: '#2C2C2C', color: 'white', border: 'none' }}
          onClick={() => decrement(field)}
        >
          -
        </button>
        <span className="fs-4 mx-2">{value}</span>
        <button
          type="button"
          className="btn ms-2"
          style={{ backgroundColor: '#2C2C2C', color: 'white', border: 'none' }}
          onClick={() => increment(field)}
        >
          +
        </button>
      </div>
    </div>
  </div>
);

export default CreateReport;
