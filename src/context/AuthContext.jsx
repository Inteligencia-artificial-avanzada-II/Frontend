import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { getEnvironmentURL } from "../utils/getUrl"

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);  // Estado de carga inicial en true
  const [error, setError] = useState(null);
  const apiUrlUsuario = `${getEnvironmentURL()}/usuario`;

  // Función para iniciar sesión (llamada a la API de autenticación)
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${apiUrlUsuario}/login`, credentials);

      const userToken = response.data.data.token; // Obtener el token de la respuesta
      setToken(userToken);
      localStorage.setItem('token', userToken); // Guardar el token en localStorage
      setIsAuthenticated(true);

      return true; // Login exitoso
    } catch (error) {
      console.error('Error en login:', error);
      setError(error.response?.data?.message || 'Error al iniciar sesión');  // Mostrar error detallado
      return false; // Error en el login
    } finally {
      setLoading(false);
    }
  };

  // Función para validar el token
  const validateToken = async (storedToken) => {
    try {
      const response = await axios.post(`${apiUrlUsuario}/validatoken`, { token: storedToken }, {headers: {Authorization: `Token ${storedToken}`}});
      return response.status === 200;  // Si es 200, el token es válido
    } catch (error) {
      return false; // Token inválido o error en la validación
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setError(null);
  };

  // Verificar el token al montar el componente
  useEffect(() => {
    const checkToken = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        const tokenValido = await validateToken(storedToken);  // Validar token
        if (tokenValido) {
          setToken(storedToken);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');  // Borrar token si no es válido
          setIsAuthenticated(false);
        }
      }
      setLoading(false);  // Finalizar el estado de carga
    };

    checkToken();  // Llamar la función de verificación
  }, []);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, validateToken, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext };
