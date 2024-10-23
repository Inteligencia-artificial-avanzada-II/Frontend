import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
    const { validateToken } = useAuth();
    const [isTokenValid, setIsTokenValid] = useState(null);  // Estado para almacenar la validez del token
    const [loading, setLoading] = useState(true);  // Estado de carga mientras se valida el token

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                const isValid = await validateToken(token);  // Asume que validateToken es asíncrono
                setIsTokenValid(isValid);  // Actualiza el estado según si el token es válido o no
                if (!isValid) {
                    localStorage.removeItem("token");  // Remover el token si es inválido
                }
            } else {
                setIsTokenValid(false);  // No hay token, así que no está autenticado
            }
            setLoading(false);  // Finaliza la carga
        };

        checkToken();  // Ejecutar la verificación del token
    }, [validateToken]);

    // Mostrar un estado de carga mientras se valida el token
    if (loading) {
        return <div>Cargando...</div>;
    }

    // Si el token es inválido, redirigir al login
    if (!isTokenValid) {
        return <Navigate to="/" replace />;
    }

    // Si el token es válido, renderizar el componente hijo
    return children;
};

// Definir PropTypes
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,  // children debe ser un nodo de React y es requerido
};

export default ProtectedRoute;
