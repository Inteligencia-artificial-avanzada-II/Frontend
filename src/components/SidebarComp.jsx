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
                        <NavLink to="/home" className={`nav-link w-100 ${styles.navLink}`} activeClassName={styles.active}>
                            Dashboard
                        </NavLink>
                    </li>
                    <li className={`nav-item d-flex ${styles.navItem}`}>
                        <NavLink to="/about" className={`nav-link w-100 ${styles.navLink}`} activeClassName={styles.active}>
                            Modelo
                        </NavLink>
                    </li>
                    <li className={`nav-item d-flex ${styles.navItem}`}>
                        <NavLink to="/services" className={`nav-link w-100 ${styles.navLink}`} activeClassName={styles.active}>
                            Histórico
                        </NavLink>
                    </li>
                    <li className={`nav-item d-flex ${styles.navItem}`}>
                        <NavLink to="/contact" className={`nav-link w-100 ${styles.navLink}`} activeClassName={styles.active}>
                            Reportes
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default SidebarComp;
