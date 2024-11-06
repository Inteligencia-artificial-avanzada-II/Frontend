import { NavLink } from 'react-router-dom';
import styles from "../styles/styles-sidebarcomp.module.scss";

import bimboLogo from "../assets/bimboLogoDos.png"

const SidebarComp = () => {
    return (
        <div className={`d-flex flex-column bg-light p-3 ${styles.sidebar}`}>
            <div className={`${styles.logoContainer}`}>
                <img src={bimboLogo} className={`img-fluid ${styles.logoBimbo}`} alt="Bimbo" />
            </div>
            <div className={`h-100 ${styles.navLinkContainer}`}>
                <ul className={`nav d-flex flex-column ${styles.ulContainer}`}>
                    <li className={`nav-item d-flex ${styles.navItem}`}>
                        <NavLink
                            to="/home"
                            className={({ isActive }) =>
                                `nav-link w-100 ${styles.navLink} ${isActive ? styles.active : ""}`
                            }
                        >
                            Dashboard
                        </NavLink>
                    </li>
                    <li className={`nav-item d-flex ${styles.navItem}`}>
                        <NavLink
                            to="/historico"
                            className={({ isActive }) =>
                                `nav-link w-100 ${styles.navLink} ${isActive ? styles.active : ""}`
                            }
                        >
                            Histórico
                        </NavLink>
                    </li>
                    <li className={`nav-item d-flex ${styles.navItem}`}>
                        <NavLink
                            to="/reportes"
                            className={({ isActive }) =>
                                `nav-link w-100 ${styles.navLink} ${isActive ? styles.active : ""}`
                            }
                        >
                            Reportes
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default SidebarComp;