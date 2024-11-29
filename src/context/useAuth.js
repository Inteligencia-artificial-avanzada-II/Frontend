// Importaciones necesarias
// - useContext: Hook de React para consumir un contexto.
// - AuthContext: Contexto de autenticación que se proporciona desde AuthContext.js.
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

// Este hook simplifica el acceso al contexto de autenticación en los componentes.
export const useAuth = () => {
    // Retorna el valor actual del AuthContext.
    // Proporciona acceso a los estados y funciones relacionadas con la autenticación.
    return useContext(AuthContext);
};