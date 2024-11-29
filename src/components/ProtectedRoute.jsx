// Importaciones necesarias
// - useEffect, useState: Hooks para manejar estado y efectos secundarios.
// - Navigate: Componente de react-router-dom para redirigir al usuario.
// - useAuth: Hook personalizado que proporciona funciones y datos de autenticación.
// - PropTypes: Para validar las props del componente.
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import PropTypes from 'prop-types';

// Componente `ProtectedRoute` para proteger rutas y controlar acceso basado en autenticación y roles.
const ProtectedRoute = ({ children, allowedRoles }) => {
    // Hook `useAuth` para obtener funciones y estado relacionados con la autenticación.
    const { validateToken, rolUsuario } = useAuth();
    // Estado para verificar si el token es válido.
    const [isTokenValid, setIsTokenValid] = useState(null);
    // Estado para mostrar si la validación está en progreso.
    const [loading, setLoading] = useState(true);

    // useEffect para ejecutar la validación del token al montar el componente.
    useEffect(() => {
        // Función interna para validar el token.
        const checkToken = async () => {
            const token = localStorage.getItem("token"); // Recupera el token del almacenamiento local.

            if (token) {
                // Valida el token utilizando la función `validateToken` del contexto de autenticación.
                const isValid = await validateToken(token);
                setIsTokenValid(isValid); // Actualiza el estado según la validez del token.
                // Si el token no es válido, lo elimina del almacenamiento local.
                if (!isValid) {
                    localStorage.removeItem("token");
                }
            } else {
                // Si no hay token, marca el estado como no válido.
                setIsTokenValid(false);
            }
            // Marca la validación como completada.
            setLoading(false);
        };

        checkToken();
    }, [validateToken]); // El renderizado depende de `validateToken`.

    // Renderizado condicional mientras se realiza la validación.
    if (loading) {
        return <div>Cargando...</div>; // Muestra un mensaje de carga.
    }

    // Si el token no es válido, redirige a la página de inicio de sesión.
    if (!isTokenValid) {
        return <Navigate to="/" replace />;
    }

    // Si el usuario no tiene un rol permitido, redirige según su rol.
    if (!allowedRoles.includes(rolUsuario)) {
        // Redirige a la ruta principal según el rol del usuario
        return <Navigate to={rolUsuario === "Admin" ? "/home" : "/order"} replace />;
    }
    // Si todas las validaciones pasan, renderiza los hijos del componente.
    return children;
};

// Validación de las props con PropTypes.
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired, // Lista de roles permitidos como array de strings.
};

export default ProtectedRoute;
