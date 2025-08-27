import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserRoleFromToken } from '../components/jwtDecode';

const ProtectedRoute = ({ element: Component, allowedRoles, ...rest }) => {
  const token = localStorage.getItem('authToken');
  const userRole = getUserRoleFromToken();

  if (!token || !userRole) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;
