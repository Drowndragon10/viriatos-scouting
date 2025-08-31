import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import mobile1 from '../images/mobile1.png';
import mobile2 from '../images/mobile2.png';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#181818', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {/* Navbar */}
      <nav style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '30px 0 10px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <img src={logo} alt="Logo" style={{ width: 70, height: 70, objectFit: 'contain' }} />
          <span style={{ color: 'white', fontWeight: 700, fontSize: 32, letterSpacing: 1 }}>Viriatos Scouting</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          style={{
            marginLeft: 40,
            background: 'white',
            color: '#181818',
            border: 'none',
            borderRadius: 20,
            padding: '10px 28px',
            fontWeight: 600,
            fontSize: 16,
            boxShadow: '0 2px 8px #0002',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          Avançar para Login
        </button>
      </nav>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 60, padding: '0 5vw' }}>
        {/* Esquerda: Texto e botão */}
        <div style={{ maxWidth: 400, color: 'white', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 10 }}>
              Uma aplicação exclusiva para o Académico de Viseu.<br />
              Uma nova plataforma onde se poderá realizar e analisar as estatísticas dos jogadores.
            </div>
          </div>
          <a
            href="#"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(90deg, #FFD600 0%, #FFB800 100%)',
              color: '#181818',
              fontWeight: 700,
              fontSize: 18,
              border: 'none',
              borderRadius: 16,
              padding: '14px 32px',
              boxShadow: '0 2px 12px #FFD60055',
              textDecoration: 'none',
              marginTop: 10,
              marginBottom: 10,
              transition: 'filter 0.2s',
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Faça o Download aqui!
          </a>
        </div>

        {/* Direita: Imagens dos telemóveis */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
          <div style={{ display: 'flex', gap: 32 }}>
            <img src={mobile2} alt="Mobile 2" style={{ width: 180, height: 'auto', borderRadius: 32, boxShadow: '0 4px 24px #0008' }} />
            <img src={mobile1} alt="Mobile 1" style={{ width: 180, height: 'auto', borderRadius: 32, boxShadow: '0 4px 24px #0008' }} />
          </div>
          <div style={{ color: 'white', fontSize: 18, fontWeight: 500, marginTop: 10, textAlign: 'right', width: 380 }}>
            Veja e avalie jogadores de forma fácil e rápida.
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ width: '100%', textAlign: 'center', color: '#fff', padding: '18px 0 10px 0', fontWeight: 500, fontSize: 18, letterSpacing: 1, background: 'transparent' }}>
        Viriatos Scouting
      </footer>
    </div>
  );
};

export default HomePage;
