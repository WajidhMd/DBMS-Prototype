import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useDb } from './DbContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { targetDb } = useDb();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token, targetDb]);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, selectedDb) => {
    const db = selectedDb || targetDb;
    const res = await api.post('/auth/login', { email, password }, {
      headers: { 'x-database-type': db }
    });

    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    return res.data;
  };

  const register = async (formData, selectedDb) => {
    const db = selectedDb || targetDb;
    const res = await api.post('/auth/register', formData, {
      headers: { 'x-database-type': db }
    });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, role: user?.role, loading, login, register, logout, fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
