// Importaciones necesarias
// - useState: Hook de React para manejar el estado local.
// - BrowserRouter, Routes, Route, Navigate: Componentes de react-router-dom para manejar la navegación.
// - useAuth: Hook personalizado para acceder al contexto de autenticación.
// - Componentes personalizados: Rutas protegidas, rutas públicas, páginas y el Sidebar.
// - styles: Archivo SCSS modular para los estilos personalizados.
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

import styles from "../styles/styles-approuter.module.scss"; // Para los estilos CSS
import HistoricPage from "../pages/HistoricoPage/HistoricPage";

import Reportes from "../pages/ReportesAdmin/Reportes";

// Maneja todas las rutas de la aplicación, incluyendo rutas públicas, protegidas y la estructura de layout.
const AppRouter = () => {
  // Acceso al estado de autenticación mediante el contexto.
  const { isAuthenticated, loading, rolUsuario } = useAuth(); // Obtenemos isAuthenticated y loading
  // Estado para manejar el estado del Sidebar en dispositivos móviles.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Función para alternar el estado del Sidebar (mostrar/ocultar).
  const botonPresionado = () => {
    setSidebarOpen(!sidebarOpen); // Alterna el sidebar
  };

  // Si la aplicación está en estado de carga, mostramos un mensaje de "Cargando".
  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Router>
      {/* Contenedor principal de la aplicación */}
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
              <SidebarComp rolUsuario={rolUsuario} />
            </div>
          )}

          {/* Sidebar normal visible en pantallas grandes */}
          {isAuthenticated ? (
            <div className="d-none d-md-block col-md-3 col-lg-2 p-0">
              <SidebarComp rolUsuario={rolUsuario} />
            </div>
          ) : null}

          {/* Contenedor principal del contenido */}
          <main
            className={`${
              isAuthenticated
                ? `mt-5 mt-md-0 col-12 col-md-9 col-lg-10 ${styles.backgroundDashboard}`
                : "col-12"
            }`}
          >
            <Routes>
              {/* Ruta pública: Página de Login */}
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />

              {/* Ruta protegida: Página de inicio para Administradores */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <HomePage />
                  </ProtectedRoute>
                }
              />

              {/* Ruta protegida: Página de Ordenes */}
              <Route
                path="/order"
                element={
                  <ProtectedRoute allowedRoles={["Orden"]}>
                    <OrderPage />
                  </ProtectedRoute>
                }
              />

              {/* Ruta protegida: Página de Histórico de Órdenes */}
              <Route
                path="/historicoor"
                element={
                  <ProtectedRoute allowedRoles={["Orden"]}>
                    <HistoricPage />
                  </ProtectedRoute>
                }
              />

              {/* Ruta protegida: Reportes para Administradores */}
              <Route
                path="/reportes"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <Reportes />
                  </ProtectedRoute>
                }
              />

              {/* Redirigir rutas desconocidas según la autenticación */}
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
