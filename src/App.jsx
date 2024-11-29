// Importaciones de estilos de Bootstrap
// - CSS de Bootstrap para los estilos base.
// - JS de Bootstrap para las interacciones como modales y dropdowns.
// - Boxicons y Font Awesome para íconos adicionales.
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'boxicons/css/boxicons.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Importación de fuentes personalizadas
// - Urbanist: Fuente principal utilizada en la aplicación.
// - Incluye estilos normales (400) y negritas (700).
import '@fontsource/urbanist'; // Estilo normal 400
import '@fontsource/urbanist/700.css'; // Estilo bold 700

// Importación de componentes principales
// - AppRouter: Componente que maneja las rutas y la navegación de la aplicación.
// - AuthProvider: Proveedor del contexto de autenticación para compartir el estado y funciones de autenticación.
import AppRouter from "./router/AppRouter"
import { AuthProvider } from './context/AuthContext';

// Componente principal de la aplicación
// - Envuelve `AppRouter` con `AuthProvider` para proporcionar el contexto de autenticación a toda la aplicación.
function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
