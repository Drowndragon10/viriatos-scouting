import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaHome,
    FaUsers,
    FaCalendarAlt,
    FaAward,
    FaUserTag,
    FaUser,
    FaChartLine,
    FaTasks,
    FaSignOutAlt,
    FaSpinner,
} from 'react-icons/fa';
import { getUserRoleFromToken } from '../components/jwtDecode';

const Sidebar = () => {
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [hoveredButton, setHoveredButton] = useState(null);

    const idTipoUtilizador = getUserRoleFromToken();

    const handleLogout = () => {
        setIsLoggingOut(true);

        setTimeout(() => {
            localStorage.removeItem('authToken');
            navigate('/login');
            setIsLoggingOut(false);
        }, 500);
    };

    const menuItems = [
        { icon: <FaHome />, label: 'Dashboard', path: '/dashboard', roles: [1] },
        { icon: <FaUsers />, label: 'Equipas', path: '/teams', roles: [1, 2, 3] },
        { icon: <FaCalendarAlt />, label: 'Calendário de Jogos', path: '/jogos', roles: [1, 2, 3] },
        { icon: <FaAward />, label: 'Categoria Etária', path: '/categorias', roles: [1] },
        { icon: <FaUserTag />, label: 'Posições', path: '/posicoes', roles: [1] },
        { icon: <FaUser />, label: 'Jogadores', path: '/atletas', roles: [1, 2, 3] },
        { icon: <FaChartLine />, label: 'Relatórios', path: '/relatorios', roles: [1] },
        { icon: <FaTasks />, label: 'Tarefas', path: '/tarefas', roles: [1] },
        { icon: <FaTasks />, label: 'Minhas Tarefas', path: '/minhastarefas', roles: [3] },
        { icon: <FaChartLine />, label: 'Meus Relatórios', path: '/relatorios', roles: [3] },
    ];

    const filteredMenuItems = menuItems.filter(item => item.roles.includes(idTipoUtilizador));

    return (
        <div
            className="d-flex flex-column text-white vh-100"
            style={{
                width: '250px',
                transition: 'width 0.3s ease',
                backgroundColor: '#121212',
                boxShadow: '5px 0 10px rgba(0, 0, 0, 0.3)',
                borderTopRightRadius: '20px',
                borderBottomRightRadius: '20px',
            }}
        >
            <div className="text-center py-3">
                <h5 className="mt-2 titulo" style={{ color: 'white' }}>
                    Viriatos Scouting
                </h5>
            </div>

            {/* Menu */}
            <ul className="nav flex-column text-center p-2">
                {filteredMenuItems.map((item, index) => (
                    <li className="nav-item" key={index}>
                        <button
                            className="btn w-100 text-start d-flex align-items-center"
                            onClick={() => navigate(item.path)}
                            onMouseEnter={() => setHoveredButton(item.path)}
                            onMouseLeave={() => setHoveredButton(null)}
                            style={{
                                backgroundColor: hoveredButton === item.path ? '#333333' : '#121212',
                                border: 'none',
                                color: 'white',
                                boxShadow: 'none',
                                paddingLeft: '20px',
                                paddingRight: '20px',
                                transition: 'background-color 0.3s ease',
                            }}
                        >
                            <span style={{ fontSize: '1.25rem', marginRight: '10px' }}>{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    </li>
                ))}
            </ul>

            {/* Apenas Logout */}
            <div className="mt-auto text-center p-2">
                <button
                    className="btn w-100 d-flex align-items-center justify-content-center"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    onMouseEnter={() => setHoveredButton('logout')}
                    onMouseLeave={() => setHoveredButton(null)}
                    style={{
                        backgroundColor: hoveredButton === 'logout' ? '#333333' : '#121212',
                        border: 'none',
                        color: 'white',
                        boxShadow: 'none',
                        paddingLeft: '20px',
                        paddingRight: '20px',
                        transition: 'background-color 0.3s ease',
                    }}
                >
                    {isLoggingOut ? (
                        <FaSpinner className="spin" style={{ fontSize: '1.25rem', marginRight: '10px' }} />
                    ) : (
                        <FaSignOutAlt style={{ fontSize: '1.25rem', marginRight: '10px' }} />
                    )}
                    <span>Sair</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
