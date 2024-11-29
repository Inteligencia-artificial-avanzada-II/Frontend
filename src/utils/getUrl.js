// Exporta una función que selecciona la URL base según el entorno actual
export const getEnvironmentURL = () => {
    // Obtiene el entorno desde las variables de entorno (por defecto 'DEV' si no está definido)
    const ENV = import.meta.env.VITE_ENV || 'DEV'; // Obtener el valor de ENV

    // Obtiene las URLs de desarrollo y producción desde las variables de entorno
    const URL_DEV = import.meta.env.VITE_URL_DEV;  // URL de desarrollo
    const URL_PROD = import.meta.env.VITE_URL_PROD; // URL de producción

    // Retorna la URL correspondiente dependiendo del entorno actual
    return ENV === 'PROD' ? URL_PROD : URL_DEV;
};
