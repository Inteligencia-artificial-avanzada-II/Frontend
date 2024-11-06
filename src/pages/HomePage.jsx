import { useEffect, useState } from "react";
import styles from "../styles/styles-homepage.module.scss"
import { getEnvironmentURL } from "../utils/getUrl";
import axios from "axios";

const productosDisponibles = [
    { id: 1, itemCode: "001", itemDescription: "Mantecadas Mármol", requestedQuantity: "1 tarima", salePrice: "25.00" },
    { id: 2, itemCode: "002", itemDescription: "Donas Azucaradas", requestedQuantity: "2 tarimas", salePrice: "15.00" },
    { id: 3, itemCode: "003", itemDescription: "Pan Blanco", requestedQuantity: "3 tarimas", salePrice: "20.00" },
    { id: 4, itemCode: "004", itemDescription: "Pan Integral", requestedQuantity: "2 tarimas", salePrice: "22.00" },
    { id: 5, itemCode: "005", itemDescription: "Nito", requestedQuantity: "1 tarima", salePrice: "10.00" },
    { id: 6, itemCode: "006", itemDescription: "Gansito", requestedQuantity: "2 tarimas", salePrice: "12.00" },
    { id: 7, itemCode: "007", itemDescription: "Roles de Canela", requestedQuantity: "1 tarima", salePrice: "18.00" },
    { id: 8, itemCode: "008", itemDescription: "Barritas Fresa", requestedQuantity: "3 tarimas", salePrice: "14.00" },
    { id: 9, itemCode: "009", itemDescription: "Tortillinas", requestedQuantity: "4 tarimas", salePrice: "11.00" },
    { id: 10, itemCode: "010", itemDescription: "Pingüinos", requestedQuantity: "2 tarimas", salePrice: "16.00" }
];

const HomePage = () => {
    const [opcion, setOpcion] = useState('opcionAutomatica');
    const [archivoSubido, setArchivoSubido] = useState(false);
    const [priorityProducts, setPriorityProducts] = useState([]);
    const [priorityProductsGet, setPriorityProductsGet] = useState([])
    const [selectedProductId, setSelectedProductId] = useState('');
    const apiOrdenUrl = `${getEnvironmentURL()}/orden`
    const apiProductoPrioritario = `${getEnvironmentURL()}/priorityproduct`

    const subirArchivo = async (event) => {
        if (event.target.files.length > 0) {
            const token = localStorage.getItem('token');
            const archivo = event.target.files[0];
            const formData = new FormData();
            formData.append('file', archivo);

            try {
                const responseUpload = await axios.post(`${apiOrdenUrl}/csvUpload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Token ${token}`,
                    },
                });

                if (responseUpload.status === 200) {
                    setArchivoSubido(true); // Mostrar mensaje de éxito

                    // Ocultar mensaje después de 3 segundos
                    setTimeout(() => {
                        setArchivoSubido(false);
                    }, 3000);
                }
            } catch (error) {
                console.error('Error al subir el archivo', error);
            }
        }
    };


    const handleAgregarProducto = () => {
        const productoSeleccionado = productosDisponibles.find(producto => producto.id === parseInt(selectedProductId));
        if (productoSeleccionado && !priorityProducts.some(prod => prod.id === productoSeleccionado.id)) {
            setPriorityProducts([...priorityProducts, productoSeleccionado]);
            setSelectedProductId('');
        }
    };

    const handleEliminarProducto = (id) => {
        setPriorityProducts(priorityProducts.filter(producto => producto.id !== id));
    };

    useEffect(() => {
        const obtenerProductosDisponibles = () => {
            const token = localStorage.getItem('token');
            const urlConsultarTodos = `${apiProductoPrioritario}/consultarTodos`;

            axios.get(urlConsultarTodos, { headers: { "Authorization": `Token ${token}` } })
                .then((response) => {
                    const products = response.data.data?.products || []; // Obtiene los productos si existen
                    setPriorityProductsGet(products);
                    console.log("Productos obtenidos:", products);
                })
                .catch((error) => {
                    console.error("Error al obtener los productos:", error);
                });
        };

        // Llamada inicial para obtener los productos prioritarios al montar el componente
        obtenerProductosDisponibles();
    }, []);

    // Función para actualizar los productos prioritarios en la base de datos cuando `priorityProducts` cambia
    useEffect(() => {
        if (priorityProducts.length >= 0) { // Solo hace la llamada si hay cambios en `priorityProducts`
            const token = localStorage.getItem('token');
            const urlCrearPriorityProduct = `${apiProductoPrioritario}/crear`;

            axios
                .post(urlCrearPriorityProduct, { products: priorityProducts }, { headers: { "Authorization": `Token ${token}` } })
                .then((response) => {
                    console.log("Productos prioritarios actualizados:", response.data);
                    // Refrescar la lista después de actualizarla en la base de datos
                    setPriorityProductsGet(priorityProducts);
                })
                .catch((error) => {
                    console.error("Error al actualizar los productos prioritarios:", error);
                });
        }
    }, [priorityProducts]);

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
                            { id: 1, placas: 'idContenedor1', sku: 'SKU1', puerta: 'En zona de espera A' },
                            { id: 2, placas: 'idContenedor2', sku: 'SKU2', puerta: 'En zona de espera B' },
                            { id: 3, placas: 'idContenedor3', sku: 'SKU3', puerta: 'En zona de espera C' },
                            { id: 4, placas: 'idContenedor4', sku: 'SKU4', puerta: 'En zona de espera D' },
                            { id: 5, placas: 'idContenedor5', sku: 'SKU5', puerta: 'En zona de espera A' },
                            { id: 6, placas: 'idContenedor6', sku: 'SKU6', puerta: 'En tránsito' },
                            { id: 7, placas: 'idContenedor7', sku: 'SKU7', puerta: 'Puerta 3' },
                            { id: 8, placas: 'idContenedor8', sku: 'SKU8', puerta: 'Puerta 6' },
                            { id: 9, placas: 'idContenedor9', sku: 'SKU9', puerta: 'En zona de espera B' },
                            { id: 10, placas: 'idContenedor10', sku: 'SKU10', puerta: 'En zona de espera C' },
                            { id: 11, placas: 'idContenedor11', sku: 'SKU11', puerta: 'Puerta 8' },
                            { id: 12, placas: 'idContenedor12', sku: 'SKU12', puerta: 'En zona de espera D' },
                            { id: 13, placas: 'idContenedor13', sku: 'SKU13', puerta: 'En tránsito' },
                            { id: 14, placas: 'idContenedor14', sku: 'SKU14', puerta: 'Puerta 11' },
                            { id: 15, placas: 'idContenedor15', sku: 'SKU15', puerta: 'En zona de espera A' },
                            { id: 16, placas: 'idContenedor16', sku: 'SKU16', puerta: 'En zona de espera B' },
                            { id: 17, placas: 'idContenedor17', sku: 'SKU17', puerta: 'En zona de espera C' },
                            { id: 18, placas: 'idContenedor18', sku: 'SKU18', puerta: 'Puerta 5' },
                            { id: 19, placas: 'idContenedor19', sku: 'SKU19', puerta: 'En tránsito' },
                            { id: 20, placas: 'idContenedor20', sku: 'SKU20', puerta: 'En zona de espera D' }
                        ]
                            .map((camion) => (
                                <li key={camion.id} className={`d-flex justify-content-between align-items-center mb-3 row ${styles.itemCamion}`}>
                                    <div className={`${styles.numeroCamion} col`}>
                                        {camion.id}
                                    </div>
                                    <div className="flex-grow-1 ms-3 col">
                                        <div>{camion.placas}</div>
                                    </div>
                                    <div className={`${styles.puertaCamion} col`}>
                                        {camion.puerta}
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>
                <div className={`col-12 col-md-8 px-3 ${styles.modeloPrioridad}`}>
                    <div className="row">
                        <div className={`col-12 col-lg-6 p-3 ${styles.opciones}`}>
                            <button
                                className={`${styles.boton} ${opcion === 'opcionManual' ? styles.activo : ''}`}
                                onClick={() => setOpcion('opcionManual')}
                            >
                                Opción Manual
                            </button>
                            <button
                                className={`${styles.boton} ${opcion === 'opcionAutomatica' ? styles.activo : ''}`}
                                onClick={() => setOpcion('opcionAutomatica')}
                            >
                                Opción Automática
                            </button>
                        </div>
                        <div className={`col-12 col-lg-6 p-3 ${styles.cargarArchivo}`}>
                            <label className={styles.botonArchivo}>
                                Cargar Órdenes
                                <input
                                    type="file"
                                    onChange={subirArchivo}
                                    className={styles.inputArchivo}
                                />
                            </label>
                            {archivoSubido && (
                                <p className={styles.mensajeExito}>Archivo subido correctamente</p>
                            )}
                        </div>
                        <div className="col-12 col-lg-6 p-3">
                            <h3 className={styles.titulo}>LISTA DE PRIORIDAD</h3>
                            <ul className={styles.lista}>
                                {[
                                    { id: 1, placas: 'idContenedor1', sku: 'SKU1', puerta: 'En zona de espera A' },
                                    { id: 2, placas: 'idContenedor2', sku: 'SKU2', puerta: 'En zona de espera B' },
                                    { id: 3, placas: 'idContenedor3', sku: 'SKU3', puerta: 'En zona de espera C' },
                                    { id: 4, placas: 'idContenedor4', sku: 'SKU4', puerta: 'En zona de espera D' },
                                    { id: 5, placas: 'idContenedor5', sku: 'SKU5', puerta: 'En zona de espera A' },
                                    { id: 6, placas: 'idContenedor6', sku: 'SKU6', puerta: 'En tránsito' },
                                    { id: 7, placas: 'idContenedor7', sku: 'SKU7', puerta: 'Puerta 3' },
                                    { id: 8, placas: 'idContenedor8', sku: 'SKU8', puerta: 'Puerta 6' },
                                    { id: 9, placas: 'idContenedor9', sku: 'SKU9', puerta: 'En zona de espera B' },
                                    { id: 10, placas: 'idContenedor10', sku: 'SKU10', puerta: 'En zona de espera C' },
                                    { id: 11, placas: 'idContenedor11', sku: 'SKU11', puerta: 'Puerta 8' },
                                    { id: 12, placas: 'idContenedor12', sku: 'SKU12', puerta: 'En zona de espera D' },
                                    { id: 13, placas: 'idContenedor13', sku: 'SKU13', puerta: 'En tránsito' },
                                    { id: 14, placas: 'idContenedor14', sku: 'SKU14', puerta: 'Puerta 11' },
                                    { id: 15, placas: 'idContenedor15', sku: 'SKU15', puerta: 'En zona de espera A' },
                                    { id: 16, placas: 'idContenedor16', sku: 'SKU16', puerta: 'En zona de espera B' },
                                    { id: 17, placas: 'idContenedor17', sku: 'SKU17', puerta: 'En zona de espera C' },
                                    { id: 18, placas: 'idContenedor18', sku: 'SKU18', puerta: 'Puerta 5' },
                                    { id: 19, placas: 'idContenedor19', sku: 'SKU19', puerta: 'En tránsito' },
                                    { id: 20, placas: 'idContenedor20', sku: 'SKU20', puerta: 'En zona de espera D' }
                                ]

                                    .filter(camion => camion.puerta.includes('zona de espera'))
                                    .sort((a, b) => a.id - b.id)
                                    .map((camion, index) => (
                                        <li key={camion.id} className={styles.item}>
                                            <span className={styles.prioridad}>Prioridad {index + 1}:</span>
                                            <span className={styles.detalle}>{camion.placas} - {camion.sku} - {camion.puerta}</span>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                        <div className="col-12 col-lg-6">
                            <h3>AÑADIR PRODUCTOS PRIORITARIOS</h3>

                            {/* Dropdown y botón de agregar */}
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                                <select
                                    value={selectedProductId}
                                    onChange={(e) => setSelectedProductId(e.target.value)}
                                    style={{ marginRight: '10px', padding: '5px' }}
                                >
                                    <option value="">Selecciona un producto</option>
                                    {productosDisponibles.map((producto) => (
                                        <option key={producto.id} value={producto.id}>
                                            {producto.itemDescription}
                                        </option>
                                    ))}
                                </select>
                                <button onClick={handleAgregarProducto} style={{ padding: '5px 10px' }}>Agregar</button>
                            </div>

                            {/* Lista de productos prioritarios */}
                            {priorityProductsGet.length > 0 ? (
                                <ul style={{ listStyleType: 'none', padding: 0, maxHeight: '150px', overflowY: 'auto' }}>
                                    {priorityProductsGet.map((producto) => (
                                        <li key={producto.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <span>{producto.itemDescription}</span>
                                            <button onClick={() => handleEliminarProducto(producto.id)} style={{ padding: '2px 5px', backgroundColor: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px' }}>Eliminar</button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ color: '#888' }}>No hay productos prioritarios agregados.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePage
