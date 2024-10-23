import styles from "../styles/styles-homepage.module.scss"

const HomePage = () => {
    return (
        <div className={`${styles.containerEstatusCamiones} col-12`}>
            <div className={`${styles.camionesEstatusCard} ${styles.camionesEnTransito} `}>

            </div>
            <div className={`${styles.camionesEstatusCard} ${styles.camionesEnPatio}`}>

            </div>
            <div className={`${styles.camionesEstatusCard} ${styles.camionesEnDescarga}`}>

            </div>
        </div>
    )
}

export default HomePage
