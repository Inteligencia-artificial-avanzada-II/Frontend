// Importaciones necesarias
// - Navigate: Componente de react-router-dom para redirigir al usuario.
// - useAuth: Hook personalizado para obtener el estado de autenticación del usuario.
// - PropTypes: Para validar las props del componente.
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import PropTypes from 'prop-types';

// Este componente se utiliza para proteger rutas públicas y redirigir a usuarios autenticados.
const PublicRoute = ({ children }) => {
    // Obtener el estado de autenticación del usuario desde el contexto de autenticación.
    const { isAuthenticated } = useAuth();

    // Verifica si el usuario está autenticado.
    // Si está autenticado, redirige automáticamente a la página principal (/home).
    if (isAuthenticated) {
        return <Navigate to="/home" replace />; // `replace` reemplaza la entrada actual en el historial.
    }

    // Si no está autenticado, renderizar el componente hijo (por ejemplo, la página de login)
    return children;
};

// Validación de las props con PropTypes
PublicRoute.propTypes = {
    children: PropTypes.node.isRequired, // Se espera un nodo React como hijo.
};

export default PublicRoute;
