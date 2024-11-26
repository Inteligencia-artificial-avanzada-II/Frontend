import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from "../styles/styles-sidebarcomp.module.scss";
import bimboLogo from "../assets/bimboLogoDos.png";
import { useAuth } from '../context/useAuth';

const SidebarComp = ({ rolUsuario }) => {
    const { logout } = useAuth();

    return (
        <div className={`d-flex flex-column bg-light p-3 ${styles.sidebar}`}>
            <div className={`${styles.logoContainer}`}>
                <img src={bimboLogo} className={`img-fluid ${styles.logoBimbo}`} alt="Bimbo" />
            </div>
            <div className={`h-100 ${styles.navLinkContainer}`}>
                <ul className={`nav d-flex flex-column ${styles.ulContainer}`}>
                    {/* Opciones para Admin */}
                    {rolUsuario === 'Admin' && (
                        <>
                            <li className={`nav-item d-flex ${styles.navItem}`}>
                                <NavLink to="/home" className={({ isActive }) => `nav-link w-100 ${styles.navLink} ${isActive ? styles.active : ""}`}>
                                    Dashboard
                                </NavLink>
                            </li>
                           
                            <li className={`nav-item d-flex ${styles.navItem}`}>
                                <NavLink to="/reportes" className={({ isActive }) => `nav-link w-100 ${styles.navLink} ${isActive ? styles.active : ""}`}>
                                    Reportes
                                </NavLink>
                            </li>
                            <li className={`nav-item d-flex w-100 ${styles.navItem}`}>
                                <button
                                    onClick={logout}
                                    className={`nav-link w-100 text-start ${styles.navLink}`}>
                                    Logout
                                </button>
                            </li>
                        </>
                    )}
                    {/* Opciones para Orden */}
                    {rolUsuario === 'Orden' && (
                        <>
                            <li className={`nav-item d-flex ${styles.navItem}`}>
                                <NavLink to="/order" className={({ isActive }) => `nav-link w-100 ${styles.navLink} ${isActive ? styles.active : ""}`}>
                                    Orden
                                </NavLink>
                            </li>
                            <li className={`nav-item d-flex ${styles.navItem}`}>
                                <NavLink to="/historicoor" className={({ isActive }) => `nav-link w-100 ${styles.navLink} ${isActive ? styles.active : ""}`}>
                                    Histórico Orden
                                </NavLink>
                            </li>
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

SidebarComp.propTypes = {
    rolUsuario: PropTypes.string.isRequired,  // Asegura que rolUsuario sea un string y es requerido
};

export default SidebarComp;
