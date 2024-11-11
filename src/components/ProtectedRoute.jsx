import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { validateToken, rolUsuario } = useAuth();
    const [isTokenValid, setIsTokenValid] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                const isValid = await validateToken(token);
                setIsTokenValid(isValid);
                if (!isValid) {
                    localStorage.removeItem("token");
                }
            } else {
                setIsTokenValid(false);
            }
            setLoading(false);
        };

        checkToken();
    }, [validateToken]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!isTokenValid) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(rolUsuario)) {
        // Redirige a la ruta principal según el rol del usuario
        return <Navigate to={rolUsuario === "Admin" ? "/home" : "/order"} replace />;
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired, // Lista de roles permitidos
};

export default ProtectedRoute;
