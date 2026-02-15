import { useAuth } from '@/store/AuthContext';
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {
 const { userData } = useAuth();

  return userData?.token ? <Outlet /> : <Navigate to="/marketing/login" replace />;
}

export default PrivateRoutes