import { jwtDecode } from 'jwt-decode';

export const getUserRoleFromToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.idUserType; 
  } catch (error) {
    console.error('Erro ao decodificar o token:', error);
    return null;
  }
};

export const getUserIdFromToken = () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    const decoded = jwtDecode(token); 
    return decoded.idUser;
  }
  return null;
};