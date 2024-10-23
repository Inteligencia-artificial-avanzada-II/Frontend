import styles from "../styles/styles-homepage.module.scss"

const HomePage = () => {
    return (
        <>
            <div className={`${styles.containerEstatusCamiones} d-flex justify-content-evenly row`}>
                <div className="col-12 col-md-4 px-3 mb-4">
                    <div className={`${styles.camionesEstatusCard} ${styles.camionesEnTransito}`}>
                        <div className={styles.icon}>
                            <i className='bx bx-navigation bx-md'></i>
                        </div>
                        <div>
                            <h5 className={styles.title}>Camiones en tránsito</h5>
                            <p className={styles.number}>18</p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4 px-3 mb-4">
                    <div className={`${styles.camionesEstatusCard} ${styles.camionesEnPatio}`}>
                        <div className={styles.icon}>
                            <i className="bx bx-loader bx-md"></i>
                        </div>
                        <div>
                            <h5 className={styles.title}>Camiones en patio</h5>
                            <p className={styles.number}>12</p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4 px-3 mb-4">
                    <div className={`${styles.camionesEstatusCard} ${styles.camionesEnDescarga}`}>
                        <div className={styles.icon}>
                            <i className="bx bx-cart-download bx-md"></i>
                        </div>
                        <div>
                            <h5 className={styles.title}>Camiones en descarga</h5>
                            <p className={styles.number}>6</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${styles.containerPrioridadModelo} d-flex justify-content-evenly px-3 row`}>
                <div className={`col-12 col-md-4 px-3 py-2 ${styles.listaOrdenCamiones}`}>
                    <ul className="list-unstyled">
                        {[
                            { id: 1, placas: '#Placas', sku: 'SKU', puerta: 'Puerta 3' },
                            { id: 2, placas: '#Placas', sku: 'SKU', puerta: 'Puerta 4' },
                            { id: 3, placas: '#Placas', sku: 'SKU', puerta: 'Puerta 1' },
                            { id: 4, placas: '#Placas', sku: 'SKU', puerta: 'Puerta 6' },
                            { id: 5, placas: '#Placas', sku: 'SKU', puerta: 'Puerta 8' },
                            { id: 6, placas: '#Placas', sku: 'SKU', puerta: 'Puerta 11' },
                            { id: 7, placas: '#Placas', sku: 'SKU', puerta: 'Puerta 15' }
                        ].map((camion) => (
                            <li key={camion.id} className={`d-flex justify-content-between align-items-center mb-3 row ${styles.itemCamion}`}>
                                <div className={`${styles.numeroCamion} col`}>
                                    #{camion.id}
                                </div>
                                <div className="flex-grow-1 ms-3 col">
                                    <div>{camion.placas}</div>
                                    <div>{camion.sku}</div>
                                </div>
                                <div className={`${styles.puertaCamion} col`}>
                                    {camion.puerta}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={`col-12 col-md-8 px-3 ${styles.modeloPrioridad}`}>
                    EN CONSTRUCCIÓN...
                </div>
            </div>
        </>
    )
}

export default HomePage
