import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import PropTypes from 'prop-types';

const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    // Si el usuario está autenticado, redirigir a la página /home
    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    // Si no está autenticado, renderizar el componente hijo (por ejemplo, la página de login)
    return children;
};

// Definir PropTypes
PublicRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PublicRoute;
