// Importaciones necesarias
// - createContext: Para crear el contexto de autenticación.
// - useState, useEffect: Hooks para manejar estados y efectos secundarios.
// - PropTypes: Validación de las props del componente.
// - axios: Para realizar solicitudes HTTP.
// - getEnvironmentURL: Función auxiliar para obtener la URL base de las APIs.
import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { getEnvironmentURL } from "../utils/getUrl";

// Creación del contexto de autenticación
const AuthContext = createContext();

// Proveedor del contexto de autenticación
// Este componente encapsula la lógica y el estado de autenticación para la aplicación.
export const AuthProvider = ({ children }) => {
  // Estados para manejar la autenticación
  const [token, setToken] = useState(null); // Almacena el token del usuario.
  const [rolUsuario, setRolUsuario] = useState(localStorage.getItem('rolUsuario') || null); // Rol del usuario autenticado.
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación.
  const [loading, setLoading] = useState(true); // Estado de carga durante la validación del token.
  const [error, setError] = useState(null); // Mensaje de error durante el login.
  const apiUrlUsuario = `${getEnvironmentURL()}/usuario`; // URL de la API de usuario

  // Función para iniciar sesión
  const login = async (credentials) => {
    setLoading(true); // Marca el inicio del proceso de login.
    setError(null); // Resetea los errores anteriores.
    try {
      // Solicitud a la API para autenticar al usuario.
      const response = await axios.post(`${apiUrlUsuario}/login`, credentials);
      // Obtiene el token y el rol del usuario desde la respuesta.
      const userToken = response.data.data.token;
      const userRol = response.data.data.rolUsuario;

      // Actualiza los estados con los datos obtenidos.
      setToken(userToken);
      setRolUsuario(userRol);
      setIsAuthenticated(true);

      // Guarda el token y el rol en localStorage para persistencia.
      localStorage.setItem('token', userToken);
      localStorage.setItem('rolUsuario', userRol); // Guardar rol directamente en localStorage

      return true; // Indica que el login fue exitoso.
    } catch (error) {
      // Manejo de errores durante el login.
      console.error('Error en login:', error);
      setError(error.response?.data?.message || 'Error al iniciar sesión');
      return false; // Indica que hubo un fallo al hacer el login
    } finally {
      setLoading(false); // Marca el fin del proceso de login.
    }
  };

  // Función para validar el token
  const validateToken = async (storedToken) => {
    try {
      // Solicitud a la API para validar el token.
      const response = await axios.post(`${apiUrlUsuario}/validatoken`, { token: storedToken }, { headers: { Authorization: `Token ${storedToken}` } });
      return response.status === 200; // Retorna `true` si la validación es exitosa.
    } catch (error) {
      return false; // Retorna `false` si la validación falla.
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    // Limpia los estados relacionados con la autenticación.
    setToken(null);
    setRolUsuario(null);

    // Elimina el token y el rol del almacenamiento local.
    localStorage.removeItem('token');
    localStorage.removeItem('rolUsuario');

    // Actualiza los estados para reflejar que el usuario no está autenticado.
    setIsAuthenticated(false);
    setError(null);
  };

  // useEffect para validar el token al cargar la aplicación.
  useEffect(() => {
    const checkToken = async () => {
      const storedToken = localStorage.getItem('token'); // Recupera el token almacenado.
      const storedRolUsuario = localStorage.getItem('rolUsuario'); // Recupera el rol almacenado.

      if (storedToken && storedRolUsuario) {
        // Valida el token almacenado.
        const tokenValido = await validateToken(storedToken);
        if (tokenValido) {
          // Si el token es válido, actualiza los estados.
          setToken(storedToken);
          setRolUsuario(storedRolUsuario);
          setIsAuthenticated(true);
        } else {
          // Si el token no es válido, lo elimina del almacenamiento local.
          localStorage.removeItem('token');
          localStorage.removeItem('rolUsuario');
          setIsAuthenticated(false);
        }
      }
      setLoading(false); // Finaliza el estado de carga.
    };

    checkToken(); // Llama a la función de validación al montar el componente.
  }, []);

  return (
    // Proveedor del contexto
    // Proporciona los valores de autenticación y las funciones relacionadas a los componentes hijos.
    <AuthContext.Provider value={{ token, rolUsuario, isAuthenticated, login, validateToken, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// Validación de las props con PropTypes
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, // Se espera un nodo React como hijo.
};

// Exporta el contexto para su uso en otros componentes.
export { AuthContext };
