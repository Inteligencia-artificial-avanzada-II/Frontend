import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { getEnvironmentURL } from "../utils/getUrl";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [rolUsuario, setRolUsuario] = useState(localStorage.getItem('rolUsuario') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrlUsuario = `${getEnvironmentURL()}/usuario`;

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${apiUrlUsuario}/login`, credentials);

      const userToken = response.data.data.token;
      const userRol = response.data.data.rolUsuario;

      setToken(userToken);
      setRolUsuario(userRol);
      setIsAuthenticated(true);

      localStorage.setItem('token', userToken);
      localStorage.setItem('rolUsuario', userRol); // Guardar rol directamente en localStorage

      return true;
    } catch (error) {
      console.error('Error en login:', error);
      setError(error.response?.data?.message || 'Error al iniciar sesión');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const validateToken = async (storedToken) => {
    try {
      const response = await axios.post(`${apiUrlUsuario}/validatoken`, { token: storedToken }, { headers: { Authorization: `Token ${storedToken}` } });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setRolUsuario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('rolUsuario');
    setIsAuthenticated(false);
    setError(null);
  };

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = localStorage.getItem('token');
      const storedRolUsuario = localStorage.getItem('rolUsuario');

      if (storedToken && storedRolUsuario) {
        const tokenValido = await validateToken(storedToken);
        if (tokenValido) {
          setToken(storedToken);
          setRolUsuario(storedRolUsuario);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('rolUsuario');
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ token, rolUsuario, isAuthenticated, login, validateToken, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext };
