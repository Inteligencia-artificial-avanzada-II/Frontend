// Función que selecciona la URL según el entorno
export const getEnvironmentURL = () => {
    const ENV = import.meta.env.VITE_ENV || 'DEV'; // Obtener el valor de ENV
    const URL_DEV = import.meta.env.VITE_URL_DEV;  // URL de desarrollo
    const URL_PROD = import.meta.env.VITE_URL_PROD; // URL de producción

    // Dependiendo del valor de ENV, devolver la URL correspondiente
    return ENV === 'PROD' ? URL_PROD : URL_DEV;
};
