import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import mobile1 from '../images/mobile1.png';
import mobile2 from '../images/mobile2.png';

const useResponsive = () => {
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowWidth;
};

const HomePage = () => {
  const navigate = useNavigate();
  const [loginHover, setLoginHover] = useState(false);
  const [downloadHover, setDownloadHover] = useState(false);
  const width = useResponsive();

  // Breakpoints
  const isTablet = width < 1000 && width >= 600;
  const isMobile = width < 600;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#181818',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'center',
          alignItems: 'center',
          padding: isMobile ? '20px 0 10px 0' : '30px 0 10px 0',
          gap: isMobile ? 16 : 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            justifyContent: isMobile ? 'center' : 'flex-start',
          }}
        >
          <img src={logo} alt="Logo" style={{ width: 60, height: 60, objectFit: 'contain' }} />
          <span
            style={{
              color: 'white',
              fontWeight: 700,
              fontSize: isMobile ? 22 : 32,
              letterSpacing: 1,
            }}
          >
            Viriatos Scouting
          </span>
        </div>
        <button
          onClick={() => navigate('/login')}
          onMouseEnter={() => setLoginHover(true)}
          onMouseLeave={() => setLoginHover(false)}
          style={{
            marginLeft: isMobile ? 0 : 40,
            marginTop: isMobile ? 12 : 0,
            background: 'white',
            color: '#181818',
            border: 'none',
            borderRadius: 20,
            padding: isMobile ? '8px 18px' : '10px 28px',
            fontWeight: 600,
            fontSize: isMobile ? 14 : 16,
            boxShadow: loginHover ? '0 4px 16px #fff5' : '0 2px 8px #0002',
            cursor: 'pointer',
            transition: 'background 0.2s, box-shadow 0.2s, filter 0.2s',
            filter: loginHover ? 'brightness(0.95)' : 'none',
          }}
        >
          Avançar para Login
        </button>
      </nav>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: isMobile ? 'column' : isTablet ? 'column' : 'row',
          justifyContent: 'center',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: isMobile ? 32 : 60,
          padding: isMobile ? '0 4vw' : '0 5vw',
        }}
      >
        {/* Esquerda: Texto e botão */}
        <div
          style={{
            maxWidth: 400,
            color: 'white',
            textAlign: isMobile ? 'center' : 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: 32,
            alignItems: isMobile ? 'center' : 'flex-start',
            margin: isMobile ? '0 auto' : 0,
          }}
        >
          <div>
            <div
              style={{
                fontSize: isMobile ? 16 : 20,
                fontWeight: 500,
                marginBottom: 10,
              }}
            >
              Uma aplicação exclusiva para o Académico de Viseu.<br />
              Uma nova plataforma onde se poderá realizar e analisar as estatísticas dos jogadores.
            </div>
          </div>
          <a
            href="#"
            onMouseEnter={() => setDownloadHover(true)}
            onMouseLeave={() => setDownloadHover(false)}
            style={{
              display: 'inline-block',
              background: 'linear-gradient(90deg, #FFD600 0%, #FFB800 100%)',
              color: '#181818',
              fontWeight: 700,
              fontSize: isMobile ? 15 : 18,
              border: 'none',
              borderRadius: 16,
              padding: isMobile ? '12px 18px' : '14px 32px',
              boxShadow: downloadHover ? '0 4px 24px #fff5' : '0 2px 12px #FFD60055',
              textDecoration: 'none',
              marginTop: 10,
              marginBottom: 10,
              transition: 'filter 0.2s, box-shadow 0.2s',
              filter: downloadHover ? 'brightness(0.93)' : 'none',
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Faça o Download aqui!
          </a>
        </div>

        {/* Direita: Imagens dos telemóveis */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 32,
            marginTop: isMobile ? 24 : 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: isMobile ? 0 : 32,
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={mobile2}
              alt="Mobile 2"
              style={{
                width: isMobile ? 140 : 180,
                height: 'auto',
                borderRadius: 32,
                boxShadow: '0 4px 24px #0008',
                marginBottom: isMobile ? 16 : 0,
              }}
            />
            <img
              src={mobile1}
              alt="Mobile 1"
              style={{
                width: isMobile ? 140 : 180,
                height: 'auto',
                borderRadius: 32,
                boxShadow: '0 4px 24px #0008',
              }}
            />
          </div>
          <div
            style={{
              color: 'white',
              fontSize: isMobile ? 15 : 18,
              fontWeight: 500,
              marginTop: 10,
              textAlign: isMobile ? 'center' : 'right',
              width: isMobile ? '100%' : 380,
              marginBottom: isMobile ? 0 : 10,
            }}
          >
            Veja e avalie jogadores de forma fácil e rápida.
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          width: '100%',
          textAlign: 'center',
          color: '#fff',
          padding: isMobile ? '14px 0 8px 0' : '18px 0 10px 0',
          fontWeight: 500,
          fontSize: isMobile ? 15 : 18,
          letterSpacing: 1,
          background: 'transparent',
          boxShadow: '0 -4px 24px #fff2',
        }}
      >
        Viriatos Scouting
      </footer>
    </div>
  );
};

export default HomePage;