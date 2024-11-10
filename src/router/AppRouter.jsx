import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuth } from "../context/useAuth";

import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import LoginPage from "../pages/LoginPage";
import SidebarComp from "../components/SidebarComp";
import HomePage from "../pages/HomePage";
import OrderPage from "../pages/OrderPage/OrderPage";

import styles from "../styles/styles-approuter.module.scss";  // Para los estilos CSS
import HistoricPage from "../pages/HistoricoPage/HistoricPage";

const AppRouter = () => {
  const { isAuthenticated, loading } = useAuth();  // Obtenemos isAuthenticated y loading
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const botonPresionado = () => {
    setSidebarOpen(!sidebarOpen);  // Alterna el sidebar
  };

  // Si loading es true, mostramos una pantalla de carga
  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Router>
      <div className="container-fluid">
        <div className="row">
          {/* Botón de menú visible solo en dispositivos móviles */}
          {isAuthenticated && (
            <div className="d-md-none">
              <button
                className={`btn btn-custom ${styles.menuButton}`}
                onClick={botonPresionado}
              >
                &#9776; {/* Ícono de hamburguesa */}
              </button>
            </div>
          )}

          {/* Sidebar desplegable cuando está abierto en móviles */}
          {isAuthenticated && sidebarOpen && (
            <div className={`col-12 p-0 d-md-none ${styles.sidebarOverlay}`}>
              <SidebarComp />
            </div>
          )}

          {/* Sidebar normal visible en pantallas grandes */}
          {isAuthenticated ? (
            <div className="d-none d-md-block col-md-3 col-lg-2 p-0">
              <SidebarComp />
            </div>
          ) : null}

          {/* Contenido principal */}
          <main className={`${isAuthenticated ? `mt-5 mt-md-0 col-12 col-md-9 col-lg-10 ${styles.backgroundDashboard}` : 'col-12'}`}>
            <Routes>
              {/* Ruta pública: Página de Login */}
              <Route path="/" element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>} />

              {/* Ruta protegida: Página de inicio (HomePage) */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/order"
                element={
                  <ProtectedRoute>
                    <OrderPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/historic"
                element={
                  <ProtectedRoute>
                    <HistoricPage />
                  </ProtectedRoute>
                }
              />

    
              {/* Redirigir cualquier otra URL dependiendo de la autenticación */}
              <Route
                path="*"
                element={<Navigate to={isAuthenticated ? "/home" : "/"} replace />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default AppRouter;
