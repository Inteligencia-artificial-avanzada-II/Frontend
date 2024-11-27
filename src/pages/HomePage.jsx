import { useEffect, useState } from "react";
import styles from "../styles/styles-homepage.module.scss"
import { getEnvironmentURL } from "../utils/getUrl";
import axios from "axios";
import { connectSocket, disconnectSocket } from "../utils/socketIO";

const HomePage = () => {
    const [archivoSubido, setArchivoSubido] = useState(false);
    const [priorityProducts, setPriorityProducts] = useState([]);
    const [priorityProductsGet, setPriorityProductsGet] = useState([])
    const [selectedProductId, setSelectedProductId] = useState('');
    const [productosDisponibles, setProductosDisponibles] = useState([]);
    const [listaPrioridad, setListaPrioridad] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const apiOrdenUrl = `${getEnvironmentURL()}/orden`
    const apiProductoPrioritario = `${getEnvironmentURL()}/priorityproduct`
    const apiContenedorUrl = `${getEnvironmentURL()}/contenedor`
    const apiListaPrioridad = `${getEnvironmentURL()}/listaprioridadcontenedor`
    const [ordenesInfoContenedores, setOrdenesInfoContenedores] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [totalContenedoresTransito, setTotalContenedoresTransito] = useState(0)
    const [totalContenedoresDescargando, setTotalContenedoresDescargando] = useState(0)
    const [totalContenedoresFosa, setTotalContenedoresFosa] = useState(0)

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

    const handleSelectOrder = (order) => {
        setSelectedOrder(order); // Guarda la orden seleccionada
    };

    const fetchListaOrdenesContenedores = async () => {
        const token = localStorage.getItem('token'); // Obtener el token de localStorage

        if (!token) {
            console.error("No se encontró el token en localStorage");
            return;
        }

        try {
            const responseOrdenesInfo = await axios.get(`${apiOrdenUrl}/obtenerOrdenesInfoContenedor`, {
                headers: { Authorization: `Token ${token}` },
            })

            const listaInfoOrdenes = responseOrdenesInfo.data

            setOrdenesInfoContenedores(listaInfoOrdenes)
        } catch (error) {
            console.log("Error al obtener la info de las órdenes: ", error)
        }

    }

    const fetchContenedoresEstatus = async () => {
        const token = localStorage.getItem('token'); // Obtener el token de localStorage

        if (!token) {
            console.error("No se encontró el token en localStorage");
            return;
        }
        try {
            const responseContenedorEstatus = await axios.get(`${apiContenedorUrl}/enTransitoDescargandoFosa`, {
                headers: { Authorization: `Token ${token}` },
            })

            const listaInfoOrdenes = responseContenedorEstatus.data
            const contenedoresTransito = listaInfoOrdenes.transito
            const contenedoresDescargando = listaInfoOrdenes.descargando
            const contenedoresFosa = listaInfoOrdenes.fosa.idContenedores

            const contenedoresTransitoCount = contenedoresTransito?.length || 0;
            const contenedoresDescargandoCount = contenedoresDescargando?.length || 0;
            const contenedoresFosaCount = contenedoresFosa?.length || 0;

            setTotalContenedoresTransito(contenedoresTransitoCount)
            setTotalContenedoresDescargando(contenedoresDescargandoCount)
            setTotalContenedoresFosa(contenedoresFosaCount)
        } catch (error) {
            console.log(`Lo sentimos, hubo un error al obtener los estatus de los contenedores: ${error}`)
        }
    }

    const fetchListaPrioridad = async () => {
        try {
            const token = localStorage.getItem('token'); // Obtener el token de localStorage

            if (!token) {
                console.error("No se encontró el token en localStorage");
                return;
            }

            // Hacer la solicitud GET a la API
            const responseListaPrioridad = await axios.get(`${apiListaPrioridad}/consultarTodos`, {
                headers: { Authorization: `Token ${token}` },
            });

            // Verificar la respuesta
            if (responseListaPrioridad && responseListaPrioridad.data) {
                const contenedores = responseListaPrioridad.data.data[0].contenedores;
                if (contenedores) {
                    const dataContenedoresList = {
                        contenedoresList: contenedores, // Lista de IDs de contenedores
                    };

                    const responseContenedoresInfo = await axios.post(
                        `${apiContenedorUrl}/obtenerContenedoresList`,
                        dataContenedoresList,
                        {
                            headers: { Authorization: `Token ${token}` },
                        }
                    );

                    const contenedoresInfoList = responseContenedoresInfo.data.data;

                    setListaPrioridad(contenedoresInfoList); // Actualizamos el estado de nuestra lista prioridad
                }
            } else {
                console.error("La respuesta de la API no contiene datos válidos");
            }
        } catch (error) {
            console.error("Error al obtener la lista de prioridad de contenedores:", error);
        }
    };

    const handleRemoveNotification = (id) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    };

    useEffect(() => {
        const socket = connectSocket("frontend-admin");

        socket.on("connect", () => {
            console.log("Socket conectado como frontend-admin.");
        });

        socket.on("puertaDesocupada", (data) => {
            console.log(`Evento recibido: Puerta ${data.idPuerta} desocupada.`);

            // Crear una nueva notificación con ID único
            const newNotification = {
                id: Date.now(), // ID único basado en el timestamp
                message: `Se ha liberado una puerta. Favor de ubicar el contenedor con id: ${data.idContenedor} a la puerta ${data.idPuerta}.`,
            };

            setNotifications((prev) => [...prev, newNotification]);

            // Eliminar automáticamente la notificación después de 5 segundos
            setTimeout(() => {
                handleRemoveNotification(newNotification.id);
            }, 20000);
        });

        return () => {
            disconnectSocket();
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchListaPrioridad();
                await fetchListaOrdenesContenedores();
                await fetchContenedoresEstatus();
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData(); // Llamar a la función asíncrona
    }, [notifications]);


    useEffect(() => {
        const fetchProductosDisponibles = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${getEnvironmentURL()}/inventariofabrica/consultarTodos`, {
                    headers: { "Authorization": `Token ${token}` },
                });
                if (response.data && response.data.length > 0) {
                    setProductosDisponibles(response.data);
                } else {
                    console.log("La respuesta de la API está vacía o no contiene datos.");
                }
            } catch (error) {
                console.error("Error al obtener productos disponibles", error);
            }
        };
        fetchProductosDisponibles();
    }, []);

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
        const fetchPriorityProducts = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${apiProductoPrioritario}/consultarTodos`, {
                    headers: { "Authorization": `Token ${token}` },
                });
                const products = response.data.data?.products || [];
                setPriorityProductsGet(products);
            } catch (error) {
                console.error("Error al obtener los productos prioritarios", error);
            }
        };
        fetchPriorityProducts();
    }, []);

    // Función para actualizar los productos prioritarios en la base de datos cuando `priorityProducts` cambia
    useEffect(() => {
        if (priorityProducts.length >= 0) { // Solo hace la llamada si hay cambios en `priorityProducts`
            const token = localStorage.getItem('token');
            const urlCrearPriorityProduct = `${apiProductoPrioritario}/crear`;

            axios
                .post(urlCrearPriorityProduct, { products: priorityProducts }, { headers: { "Authorization": `Token ${token}` } })
                .then((response) => {
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
                            <i className='bx bxs-truck bx-fade-right bx-md'></i>
                        </div>
                        <div>
                            <h5 className={styles.title}>Camiones en tránsito</h5>
                            <p className={styles.number}>{totalContenedoresTransito}</p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4 px-3 mb-4">
                    <div className={`${styles.camionesEstatusCard} ${styles.camionesEnPatio}`}>
                        <div className={styles.icon}>
                            <i className="bx bxs-truck bx-md"></i>
                        </div>
                        <div>
                            <h5 className={styles.title}>Camiones en patio</h5>
                            <p className={styles.number}>{totalContenedoresFosa}</p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4 px-3 mb-4">
                    <div className={`${styles.camionesEstatusCard} ${styles.camionesEnDescarga}`}>
                        <div className={styles.icon}>
                            <i className="bx bxs-box bx-fade-down bx-md"></i>
                        </div>
                        <div>
                            <h5 className={styles.title}>Camiones en descarga</h5>
                            <p className={styles.number}>{totalContenedoresDescargando}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${styles.containerPrioridadModelo} d-flex justify-content-evenly px-3 row`}>
                <div className={`col-12 col-md-4 px-3 py-2 ${styles.listaOrdenCamiones}`}>
                    <div className="col-12 d-flex justify-content-end">
                        <button
                            className={`${styles.reloadButton} btn btn-custom`}
                            onClick={fetchListaOrdenesContenedores}
                            title="Recargar"
                        >
                            <i className="bx bx-revision bx-spin bx-sm"></i>
                        </button>
                    </div>
                    <ul className="list-unstyled">
                        {ordenesInfoContenedores.map((camion) => (
                            <li
                                key={camion.idOrden}
                                className={`d-flex justify-content-between align-items-center mb-3 row ${styles.itemCamion}`}
                                onClick={() => handleSelectOrder(camion)} // Configura el contenedor seleccionado
                                data-bs-toggle="modal"
                                data-bs-target="#orderDetailsModal"
                                style={{ cursor: "pointer" }} // Añade un cursor de pointer
                            >
                                <div className={`${styles.numeroCamion} col`}>
                                    {camion.idContenedor}
                                </div>
                                <div className="flex-grow-1 ms-3 col">
                                    <div>{`${camion.contenedor.tipo}-${camion.contenedor.capacidad}`}</div>
                                </div>
                                <div className={`${styles.puertaCamion} col`}>
                                    {camion.origen}
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Modal dinámico */}
                    <div
                        className="modal fade"
                        id="orderDetailsModal"
                        tabIndex="-1"
                        aria-labelledby="orderDetailsModalLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="orderDetailsModalLabel">
                                        Detalles del Contenedor
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    {selectedOrder ? (
                                        <>
                                            <p>
                                                <strong>ID Orden:</strong> {selectedOrder.idOrden}
                                            </p>
                                            <p>
                                                <strong>Origen:</strong> {selectedOrder.origen}
                                            </p>
                                            <p>
                                                <strong>Contenedor:</strong> {selectedOrder.contenedor.tipo}
                                            </p>
                                            <p>
                                                <strong>Capacidad:</strong> {selectedOrder.contenedor.capacidad}
                                            </p>
                                            <p>
                                                <strong>Posición en patio:</strong> {selectedOrder.posicionPatio ? selectedOrder.posicionPatio : "No se ha actualizado la posición en el patio"}
                                            </p>
                                            <p>
                                                <strong>Productos:</strong>
                                            </p>
                                            <ul>
                                                {selectedOrder.idMongoProductos.products.map((product) => (
                                                    <li key={product._id}>
                                                        {product.itemDescription} - Cantidad: {product.requestedQuantity}
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    ) : (
                                        <p>Cargando detalles...</p>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        data-bs-dismiss="modal"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`col-12 col-md-8 px-3 ${styles.modeloPrioridad}`}>
                    <div className="row">
                        <div className="col-12 col-lg-6">
                            <div className={`col-12 p-3 ${styles.cargarArchivo}`}>
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
                            <div className="col-12 p-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h3 className={styles.titulo}>LISTA DE PRIORIDAD</h3>
                                    <button
                                        className={`${styles.reloadButton} btn btn-custom`}
                                        onClick={fetchListaPrioridad}
                                        title="Recargar"
                                    >
                                        <i className='bx bx-revision bx-spin bx-sm'></i>
                                    </button>
                                </div>
                                <ul className={styles.lista}>
                                    {listaPrioridad.map((contenedor, index) => (
                                        <li key={contenedor.idContenedor} className={styles.item}>
                                            <span className={styles.prioridad}>Prioridad {index + 1}:</span>
                                            <span className={styles.detalle}>
                                                {`Id de Contenedor: ${contenedor.idContenedor}`} - {contenedor.tipo}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="col-12 col-lg-6">
                            <div className="col-12">
                                <h3>AÑADIR PRODUCTOS PRIORITARIOS</h3>

                                {/* Dropdown y botón de agregar */}
                                <div className={styles.dropdownContainer}>
                                    <select
                                        value={selectedProductId}
                                        onChange={(e) => setSelectedProductId(e.target.value)}
                                        className={styles.dropdownSelect}
                                    >
                                        <option value="">Selecciona un producto</option>
                                        {productosDisponibles.map((producto) => (
                                            <option key={producto.id} value={producto.id}>
                                                {producto.descripcion}
                                            </option>
                                        ))}
                                    </select>
                                    <button onClick={handleAgregarProducto} className={styles.addButton}>
                                        Agregar
                                    </button>
                                </div>

                                {/* Lista de productos prioritarios */}
                                {priorityProductsGet.length > 0 ? (
                                    <ul style={{ listStyleType: 'none', padding: 0, maxHeight: '150px', overflowY: 'auto' }}>
                                        {priorityProductsGet.map((producto) => (
                                            <li key={producto.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <span>{producto.descripcion}</span>
                                                <button onClick={() => handleEliminarProducto(producto.id)} style={{ padding: '2px 5px', backgroundColor: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px' }}>Eliminar</button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p style={{ color: '#888' }}>No hay productos prioritarios agregados.</p>
                                )}
                            </div>
                            <div className="col-12">
                                <div className={`${styles.notificationsContainer}`}>
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={`${styles.notification} alert alert-info`}
                                        >
                                            <span>{notif.message}</span>
                                            <button
                                                className="btn-close"
                                                onClick={() => handleRemoveNotification(notif.id)}
                                                style={{ marginLeft: "10px" }}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePage
