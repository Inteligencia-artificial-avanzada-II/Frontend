// Importaciones necesarias
// - useEffect, useState: Hooks de React para manejar estado y efectos secundarios.
// - styles: Archivo SCSS modular para los estilos del componente.
// - getEnvironmentURL: Función para obtener la URL base según el entorno.
// - axios: Biblioteca para realizar solicitudes HTTP.
// - connectSocket, disconnectSocket: Funciones para manejar la conexión con el servidor Socket.IO.
import { useEffect, useState } from "react";
import styles from "../styles/styles-homepage.module.scss"
import { getEnvironmentURL } from "../utils/getUrl";
import axios from "axios";
import { connectSocket, disconnectSocket } from "../utils/socketIO";

// Renderiza la página inicial para el administrador (Dashboard)
const HomePage = () => {
    // Definición de estados locales
    const [archivoSubido, setArchivoSubido] = useState(false); // Indica si se subió un archivo exitosamente.
    const [priorityProducts, setPriorityProducts] = useState([]); // Productos prioritarios seleccionados.
    const [priorityProductsGet, setPriorityProductsGet] = useState([]) // Productos prioritarios recuperados de la API.
    const [selectedProductId, setSelectedProductId] = useState(''); // Producto seleccionado para añadir.
    const [productosDisponibles, setProductosDisponibles] = useState([]); // Lista de productos disponibles.
    const [listaPrioridad, setListaPrioridad] = useState([]); // Lista de contenedores con prioridad.
    const [notifications, setNotifications] = useState([]); // Lista de notificaciones.

    // URLs base para las APIs
    const apiOrdenUrl = `${getEnvironmentURL()}/orden`;
    const apiProductoPrioritario = `${getEnvironmentURL()}/priorityproduct`;
    const apiContenedorUrl = `${getEnvironmentURL()}/contenedor`;
    const apiListaPrioridad = `${getEnvironmentURL()}/listaprioridadcontenedor`;

    const [ordenesInfoContenedores, setOrdenesInfoContenedores] = useState([]); // Información de órdenes y contenedores.
    const [selectedOrder, setSelectedOrder] = useState(null); // Orden seleccionada para detalles
    const [totalContenedoresTransito, setTotalContenedoresTransito] = useState(0); // Contenedores en tránsito.
    const [totalContenedoresDescargando, setTotalContenedoresDescargando] = useState(0); // Contenedores en descarga.
    const [totalContenedoresFosa, setTotalContenedoresFosa] = useState(0); // Contenedores en fosa.

    // Función para subir un archivo al bucket
    const subirArchivo = async (event) => {
        if (event.target.files.length > 0) {
            const token = localStorage.getItem('token'); // Recupera el token desde localStorage.
            const archivo = event.target.files[0];
            const formData = new FormData();
            formData.append('file', archivo); // Añade el archivo al objeto FormData.

            try {
                // Petición para poder subir el archivo al bucket
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

    // Función para manejar la selección de una orden
    const handleSelectOrder = (order) => {
        setSelectedOrder(order); // Guarda la orden seleccionada
    };

    // Función para obtener la lista de órdenes con información de contenedores
    const fetchListaOrdenesContenedores = async () => {
        const token = localStorage.getItem('token'); // Obtener el token de localStorage

        // Si no se encuentra el token, detenemos la ejecución y mostramos mensaje de error
        if (!token) {
            console.error("No se encontró el token en localStorage");
            return;
        }

        try {
            // Solicitud para obtener todas las ordenes con la información de sus contenedores
            const responseOrdenesInfo = await axios.get(`${apiOrdenUrl}/obtenerOrdenesInfoContenedor`, {
                headers: { Authorization: `Token ${token}` },
            })

            // Obtenemos la respuesta de la petición anterior
            const listaInfoOrdenes = responseOrdenesInfo.data

            // Actualizamos la variable con la información de las órdenes y sus contenedores
            setOrdenesInfoContenedores(listaInfoOrdenes)
        } catch (error) {
            console.log("Error al obtener la info de las órdenes: ", error)
        }

    }

    // Función para obtener el estatus de los contenedores
    const fetchContenedoresEstatus = async () => {
        const token = localStorage.getItem('token'); // Obtener el token de localStorage

        // Si no se encuentra el token, detenemos la ejecución y mostramos mensaje de error
        if (!token) {
            console.error("No se encontró el token en localStorage");
            return;
        }
        try {
            // Solicitud para obtener los contenedores con sus estatus (En tránsito, Descargando o En fosa)
            const responseContenedorEstatus = await axios.get(`${apiContenedorUrl}/enTransitoDescargandoFosa`, {
                headers: { Authorization: `Token ${token}` },
            })

            // Declaramos las variables con la información que nos devuelve la solicitud
            const listaInfoOrdenes = responseContenedorEstatus.data
            const contenedoresTransito = listaInfoOrdenes.transito
            const contenedoresDescargando = listaInfoOrdenes.descargando
            const contenedoresFosa = listaInfoOrdenes.fosa.idContenedores

            // Obtenemos la cantidad de contenedores que tenemos, ya que mostramos únicamente la cantidad y en caso de que no haya datos, se devuelve un "0"
            const contenedoresTransitoCount = contenedoresTransito?.length || 0;
            const contenedoresDescargandoCount = contenedoresDescargando?.length || 0;
            const contenedoresFosaCount = contenedoresFosa?.length || 0;

            // Actualizamos las variables con el total de contenedores por cada estado (En tránsito, Descargando o En fosa)
            setTotalContenedoresTransito(contenedoresTransitoCount)
            setTotalContenedoresDescargando(contenedoresDescargandoCount)
            setTotalContenedoresFosa(contenedoresFosaCount)
        } catch (error) {
            console.log(`Lo sentimos, hubo un error al obtener los estatus de los contenedores: ${error}`)
        }
    }

    // Función para recargar datos principales
    const fetchActualizarDataAllInfo = async () => {
        try {
            // Mandamos a llamar las funciones para que se vuelvan a obtener los datos, realizando las peticiones
            await fetchListaOrdenesContenedores();
            await fetchListaPrioridad();
            await fetchContenedoresEstatus();
        } catch (error) {
            console.log(`Error al recargar los datos: ${error}`)
        }
    }

    // Función para obtener la lista de prioridad
    const fetchListaPrioridad = async () => {
        try {

            const token = localStorage.getItem('token'); // Obtener el token de localStorage

            // Si no existe el token, finalizamos la ejecución e imprimos el error en la consola
            if (!token) {
                console.error("No se encontró el token en localStorage");
                return;
            }

            // Hacer la solicitud GET a la API para obtener todos los productos que haya en lista prioridad
            const responseListaPrioridad = await axios.get(`${apiListaPrioridad}/consultarTodos`, {
                headers: { Authorization: `Token ${token}` },
            });

            // Verificar la respuesta
            if (responseListaPrioridad && responseListaPrioridad.data) {
                const contenedores = responseListaPrioridad.data.data[0].contenedores; // Obtenemos los datos que nos regresa la petición
                // Validamos que contenedores contenga datos
                if (contenedores) {
                    const dataContenedoresList = {
                        contenedoresList: contenedores, // Lista de IDs de contenedores
                    };

                    // Solicitud para obtener los contenedores que se encuentren en nuestra lista de prioridad brindada por el modelo
                    const responseContenedoresInfo = await axios.post(
                        `${apiContenedorUrl}/obtenerContenedoresList`,
                        dataContenedoresList,
                        {
                            headers: { Authorization: `Token ${token}` },
                        }
                    );

                    // Guardamos la respuesta de nuestra petición en una variable para validar que se guarde
                    const contenedoresInfoList = responseContenedoresInfo.data.data;

                    // Actualizamos nuestra variable con la lista de los contenedores
                    setListaPrioridad(contenedoresInfoList); // Actualizamos el estado de nuestra lista prioridad
                }
            } else {
                console.error("La respuesta de la API no contiene datos válidos");
            }
        } catch (error) {
            console.error("Error al obtener la lista de prioridad de contenedores:", error);
        }
    };

    // Función para manejar la eliminación de una notificación
    const handleRemoveNotification = (id) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    };

    // useEffect para manejar la conexión del socket
    useEffect(() => {
        // ID único para enviar al socket de nuestro backend
        const socket = connectSocket("frontend-admin");

        // Recibe el mensaje de conexión desde el socket de nuestro back para confirmar que la conexión fue exitosa
        socket.on("connect", () => {
            console.log("Socket conectado como frontend-admin.");
        });

        // Recibe el mensaje cuando una puerta se desocupa para mostrar la notificación
        socket.on("puertaDesocupada", (data) => {
            console.log(`Evento recibido: Puerta ${data.idPuerta} desocupada.`);

            // Crear una nueva notificación con ID único
            const newNotification = {
                id: Date.now(), // ID único basado en el timestamp
                message: `Se ha liberado una puerta. Favor de ubicar el contenedor con id: ${data.idContenedor} a la puerta ${data.idPuerta}.`,
            };

            // Actualizamos nuestra variable con las nuevas notificaciones
            setNotifications((prev) => [...prev, newNotification]);

            // Eliminar automáticamente la notificación después de 5 segundos
            setTimeout(() => {
                handleRemoveNotification(newNotification.id);
            }, 20000);
        });

        return () => {
            disconnectSocket(); // Se desconecta del socket una vez que ya no se está visualizando ese componente
        };
    }, []);

    // useEffect para cargar datos iniciales
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ejecutamos nuestras funciones al cargar el componente
                await fetchListaPrioridad();
                await fetchListaOrdenesContenedores();
                await fetchContenedoresEstatus();
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData(); // Llamar a la función asíncrona
    }, [notifications]); // Este componente depende la variable notifications


    // useEffect para obtener los productos disponibles desde la API
    useEffect(() => {
        const fetchProductosDisponibles = async () => {
            const token = localStorage.getItem('token'); // Recupera el token del localStorage.
            try {
                // Solicitud GET a la API para obtener el inventario de fábrica.
                const response = await axios.get(`${getEnvironmentURL()}/inventariofabrica/consultarTodos`, {
                    headers: { "Authorization": `Token ${token}` },
                });
                // Verifica si la respuesta contiene datos y actualiza el estado.
                if (response.data && response.data.length > 0) {
                    setProductosDisponibles(response.data); // Actualiza el estado con los productos disponibles.
                } else {
                    console.log("La respuesta de la API está vacía o no contiene datos.");
                }
            } catch (error) {
                console.error("Error al obtener productos disponibles", error);
            }
        };
        fetchProductosDisponibles(); // Llama a la función al cargar el componente.
    }, []); // El efecto se ejecuta solo una vez al cargar la página.

    // Maneja la acción de agregar un producto prioritario
    const handleAgregarProducto = () => {
        // Busca el producto seleccionado en la lista de productos disponibles.
        const productoSeleccionado = productosDisponibles.find(producto => producto.id === parseInt(selectedProductId));
        // Verifica que el producto no esté ya en la lista de productos prioritarios antes de agregarlo.
        if (productoSeleccionado && !priorityProducts.some(prod => prod.id === productoSeleccionado.id)) {
            setPriorityProducts([...priorityProducts, productoSeleccionado]); // Agrega el producto al estado.
            setSelectedProductId(''); // Resetea la selección.
        }
    };

    // Maneja la acción de eliminar un producto prioritario
    const handleEliminarProducto = (id) => {
        // Filtra el producto con el ID proporcionado de la lista de productos prioritarios.
        setPriorityProducts(priorityProducts.filter(producto => producto.id !== id));
    };

    // useEffect para obtener los productos prioritarios desde la API
    useEffect(() => {
        const fetchPriorityProducts = async () => {
            const token = localStorage.getItem('token'); // Recupera el token del localStorage.
            try {
                // Solicitud para obtener los productos prioritarios
                const response = await axios.get(`${apiProductoPrioritario}/consultarTodos`, {
                    headers: { "Authorization": `Token ${token}` },
                });
                // Actualiza el estado con la lista de productos prioritarios recuperados.
                const products = response.data.data?.products || [];
                setPriorityProductsGet(products);
            } catch (error) {
                console.error("Error al obtener los productos prioritarios", error);
            }
        };
        fetchPriorityProducts(); // Llama a la función al montar el componente.
    }, []); // El efecto se ejecuta solo una vez al montar el componente.

    // useEffect para actualizar los productos prioritarios en la base de datos
    useEffect(() => {
        // Verifica si hay cambios en la lista de productos prioritarios antes de realizar la llamada.
        if (priorityProducts.length >= 0) { // Solo hace la llamada si hay cambios en `priorityProducts`
            const token = localStorage.getItem('token'); // Recupera el token del localStorage.
            const urlCrearPriorityProduct = `${apiProductoPrioritario}/crear`; // URL para crear productos prioritarios.

            // Realizamos la solicitud para enviar los productos prioritarios
            axios
                .post(urlCrearPriorityProduct, { products: priorityProducts }, { headers: { "Authorization": `Token ${token}` } })
                .then((response) => {
                    setPriorityProductsGet(priorityProducts); // Actualiza el estado con los productos enviados.
                })
                .catch((error) => {
                    console.error("Error al actualizar los productos prioritarios:", error);
                });
        }
    }, [priorityProducts]); // El efecto se ejecuta cada vez que cambia `priorityProducts`.

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
                            onClick={fetchActualizarDataAllInfo}
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
                                        onClick={fetchActualizarDataAllInfo}
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
