// Importaciones necesarias
// - NavLink: Para manejar la navegación con estilos activos.
// - PropTypes: Validación de props para mayor robustez.
// - styles: Archivo SCSS modular para los estilos del componente.
// - bimboLogo: Imagen del logo de Bimbo.
// - useAuth: Hook personalizado para manejar la autenticación, incluyendo el logout.
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from "../styles/styles-sidebarcomp.module.scss";
import bimboLogo from "../assets/bimboLogoDos.png";
import { useAuth } from '../context/useAuth';

// Renderiza un menú de navegación lateral con enlaces dinámicos según el rol del usuario.
const SidebarComp = ({ rolUsuario }) => {
    // Función de logout para cerrar sesión obtenida del contexto de autenticación.
    const { logout } = useAuth();

    return (
        // Contenedor principal del sidebar con estilos personalizados
        <div className={`d-flex flex-column bg-light p-3 ${styles.sidebar}`}>
            {/* Contenedor del logo */}
            <div className={`${styles.logoContainer}`}>
                <img src={bimboLogo} className={`img-fluid ${styles.logoBimbo}`} alt="Bimbo" />
            </div>
            {/* Contenedor de los enlaces de navegación */}
            <div className={`h-100 ${styles.navLinkContainer}`}>
                <ul className={`nav d-flex flex-column ${styles.ulContainer}`}>
                    {/* Opciones para Admin */}
                    {rolUsuario === 'Admin' && (
                        <>
                            {/* Enlace al Dashboard */}
                            <li className={`nav-item d-flex ${styles.navItem}`}>
                                <NavLink to="/home" className={({ isActive }) => `nav-link w-100 ${styles.navLink} ${isActive ? styles.active : ""}`}>
                                    Dashboard
                                </NavLink>
                            </li>
                            {/* Enlace a la sección de Reportes */}
                            <li className={`nav-item d-flex ${styles.navItem}`}>
                                <NavLink to="/reportes" className={({ isActive }) => `nav-link w-100 ${styles.navLink} ${isActive ? styles.active : ""}`}>
                                    Reportes
                                </NavLink>
                            </li>
                            {/* Botón para cerrar sesión */}
                            <li className={`nav-item d-flex w-100 ${styles.navItem}`}>
                                <button
                                    onClick={logout}
                                    className={`nav-link w-100 text-start ${styles.navLink}`}>
                                    Logout
                                </button>
                            </li>
                        </>
                    )}
                    {/* Opciones disponibles si el rol del usuario es 'Orden' */}
                    {rolUsuario === 'Orden' && (
                        <>
                            {/* Enlace a la página de Orden */}
                            <li className={`nav-item d-flex ${styles.navItem}`}>
                                <NavLink to="/order" className={({ isActive }) => `nav-link w-100 ${styles.navLink} ${isActive ? styles.active : ""}`}>
                                    Orden
                                </NavLink>
                            </li>
                            {/* Enlace al Histórico de Órdenes */}
                            <li className={`nav-item d-flex ${styles.navItem}`}>
                                <NavLink to="/historicoor" className={({ isActive }) => `nav-link w-100 ${styles.navLink} ${isActive ? styles.active : ""}`}>
                                    Histórico Orden
                                </NavLink>
                            </li>
                            {/* Botón para cerrar sesión */}
                            <li className={`nav-item d-flex ${styles.navItem}`}>
                                <button
                                    onClick={logout}
                                    className={`nav-link w-100 text-start ${styles.navLink}`}>
                                    Logout
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};

// Validación de props con PropTypes
// Asegura que el prop `rolUsuario` sea un string obligatorio.
SidebarComp.propTypes = {
    rolUsuario: PropTypes.string.isRequired,  // Asegura que rolUsuario sea un string y es requerido
};

export default SidebarComp;
