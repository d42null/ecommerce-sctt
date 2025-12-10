import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get('/current_user');
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post('/users/sign_in', { user: { email, password } });
    setUser(response.data); // Devise returns user info on sign in JSON
    // navigate('/');
  };

  const register = async (email, password, firstName, lastName) => {
    const response = await api.post('/users', { 
      user: { 
        email, 
        password,
        first_name: firstName,
        last_name: lastName
      } 
    });
    setUser(response.data);
    // navigate('/');
  };

  const logout = async () => {
    try {
      await api.delete('/users/sign_out');
    } finally {
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, checkAuth }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
