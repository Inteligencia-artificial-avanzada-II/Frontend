// Importaciones de librerías necesarias
// - `PropTypes`: Validación de tipos para las props.
// - `useState` y `useEffect`: Manejo del estado y efectos secundarios.
// - `axios`: Para realizar solicitudes HTTP.
// - `Swal`: Para mostrar alertas personalizadas.
// - `Toastify`: Para mostrar notificaciones estilo toast.
// - `styles`: Archivo SCSS modular para los estilos del componente.
// - `getEnvironmentURL`: Función auxiliar para obtener la URL base de las APIs.
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import styles from "../styles/styles-orderdetailformcomp.module.scss";
import { getEnvironmentURL } from "../utils/getUrl";

// Renderiza un formulario para completar detalles de un pedido y enviarlo.
const OrderDetailFormComp = ({ selectedProducts, onBack, clearSelectedProducts }) => {
  // Estados locales para manejar los datos ingresados por el usuario y los valores dinámicos.
  const [orderNumber, setOrderNumber] = useState(""); // Número de orden ingresado.
  const [origenPedido, setOrigenPedido] = useState(""); // Origen del pedido.
  const [fechaSalida, setFechaSalida] = useState(""); // Fecha y hora de salida.
  const [vehicle, setVehicle] = useState(""); // Vehículo seleccionado.
  const [container, setContainer] = useState(""); // Contenedor seleccionado.
  const [distributionCenter, setDistributionCenter] = useState(""); // Centro de distribución seleccionado.
  const [availableVehicles, setAvailableVehicles] = useState([]); // Lista de vehículos disponibles.
  const [availableContainers, setAvailableContainers] = useState([]); // Lista de contenedores disponibles.
  const [availableCedis, setAvailableCedis] = useState([]); // Lista de centros de distribución disponibles.

  // Construcción de las URLs para las APIs usando una función auxiliar.
  const apiUrlContenedor = `${getEnvironmentURL()}/contenedor`;
  const apiUrlCamion = `${getEnvironmentURL()}/camion`;
  const apiUrlCedis = `${getEnvironmentURL()}/cedis`;
  const apiUrlOrden = `${getEnvironmentURL()}/orden`;

  // Función para generar los headers de autorización con el token del usuario.
  const getAuthHeader = () => {
    const token = localStorage.getItem("token"); // Obtiene el token del localStorage.
    return { Authorization: `Token ${token}` }; // Devuelve el encabezado listo para usar.
  };

  // useEffect para cargar la lista de vehículos disponibles al montar el componente
  useEffect(() => {
    const fetchAvailableVehicles = async () => {
      try {
        // Petición para obtener los vehículos que se encuentren disponibles
        const response = await axios.get(`${apiUrlCamion}/disponibles`, {
          headers: getAuthHeader(), // Incluye el encabezado de autenticación.
        });
        // Actualiza el estado con la lista de vehículos obtenida.
        setAvailableVehicles(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error al obtener los camiones disponibles:", error);
      }
    };
    fetchAvailableVehicles();
  }, []);

  // useEffect para cargar la lista de contenedores disponibles al montar el componente
  useEffect(() => {
    const fetchAvailableContainers = async () => {
      try {
        // Petición para obtener la lista con los contenedores disponibles
        const response = await axios.get(`${apiUrlContenedor}/disponibles`, {
          headers: getAuthHeader(),
        });
        // Actualiza el estado con la lista de contenedores obtenida.
        setAvailableContainers(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error al obtener los contenedores disponibles:", error);
      }
    };
    fetchAvailableContainers();
  }, []);

  // useEffect para cargar la lista de centros de distribución (CEDIS) disponibles al montar el componente.
  useEffect(() => {
    const fetchAvailableCedis = async () => {
      try {
        // Petición para consultar todos los cedis que existan en nuestra base de datos
        const response = await axios.get(`${apiUrlCedis}/consultarTodos`, {
          headers: getAuthHeader(),
        });
        // Actualiza el estado con la lista de centros de distribución obtenida.
        setAvailableCedis(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error al obtener los centros de distribución (CEDIS):", error);
      }
    };
    fetchAvailableCedis();
  }, []);

  // Maneja el envío del formulario, realiza validaciones y envía los datos a la API.
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Muestra una alerta de confirmación antes de procesar el pedido.
    Swal.fire({
      title: "¿Estás seguro/a?",
      icon: "question",
      html: `Se enviarán los productos agregados del carrito.`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Construye los datos en formato JSON para enviar a la API.
        const createdBy = localStorage.getItem("token");
        const jsonFinal = {
          sqlData: {
            idContenedor: container || "Id del contenedor",
            idCamion: vehicle || "Id del camion",
            origen: origenPedido || "Fabrica de origen",
            idCedis: distributionCenter || "Id del cedis",
            isActive: true,
            localization: "En transito",
          },
          mongoData: {
            orderNumber: orderNumber || "string",
            createdBy: createdBy,
            modifiedBy: createdBy,
            creationDate: new Date().toISOString(),
            fechaSalida: fechaSalida || "Fecha de salida",
            products: selectedProducts.map((product) => ({
              itemCode: product.id?.toString() || "string",
              itemDescription: product.selectedOption || "Descripción no seleccionada",
              requestedQuantity: product.cantidadAgregada || 0,
              salePrice: 0,
            })),
          },
        };

        try {
          // Envía los datos a la API para registrar el pedido.
          await axios.post(`${apiUrlOrden}/crear`, jsonFinal, { headers: getAuthHeader() });
          // Muestra una notificación de éxito al usuario.
          Toastify({
            text: "Pedido finalizado",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
              background: "linear-gradient(to right, #4CAF50, #008000)",
            },
          }).showToast();
          // Limpia los productos seleccionados después de enviar el pedido.
          clearSelectedProducts();
        } catch (error) {
          console.error("Error al enviar el pedido:", error);
        }
      }
    });
  };

  return (
    <section className="col-12">
      {/* Título de la sección */}
      <h4 className="mb-4">Resumen de Pedido</h4>

      {/* Renderizado de los productos seleccionados */}
      <div className={styles.horizontalScrollContainer}>
        {selectedProducts.map((product) => (
          <div className={`card ${styles.card}`} key={product.id}>
            {/* Contenedor de la imagen */}
            <div className={styles.imageContainer}>
              <img src={product.imagen} alt={product.botana} />
            </div>
            {/* Contenedor de la información */}
            <div className={styles.infoContainer}>
              <h5 className={styles.cardTitle}>{product.botana}</h5>
              <p className={styles.cardText}>Cantidad: {product.cantidadAgregada}</p>
              {/* Descripción adicional */}
              <p className={styles.cardDescription}>
                {product.selectedOption || "No seleccionado"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Formulario para ingresar detalles del pedido */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3 row">
          <div className="col-12 col-lg-4">
            <label htmlFor="numeroOrden" className="form-label">
              Número de Orden
            </label>
            <input
              type="number"
              className="form-control"
              id="numeroOrden"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required
            />
          </div>
          <div className="col-12 col-lg-4">
            <label htmlFor="origenPedido" className="form-label">
              Origen
            </label>
            <input
              type="text"
              className="form-control"
              id="origenPedido"
              value={origenPedido}
              onChange={(e) => setOrigenPedido(e.target.value)}
              required
            />
          </div>
          <div className="col-12 col-lg-4">
            <label htmlFor="fechaSalida" className="form-label">
              Fecha de Salida
            </label>
            <input
              type="datetime-local"
              className="form-control"
              id="fechaSalida"
              value={fechaSalida}
              onChange={(e) => setFechaSalida(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="vehiculo" className="form-label">
            Vehículo
          </label>
          <select
            id="vehiculo"
            className="form-control"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            required
          >
            <option value="">Seleccione un vehículo</option>
            {availableVehicles.map((veh) => (
              <option key={veh.idCamion} value={veh.idCamion}>
                {veh.modelo} - {veh.placas}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="contenedor" className="form-label">
            Contenedor
          </label>
          <select
            id="contenedor"
            className="form-control"
            value={container}
            onChange={(e) => setContainer(e.target.value)}
            required
          >
            <option value="">Seleccione un contenedor</option>
            {availableContainers.map((cont) => (
              <option key={cont.idContenedor} value={cont.idContenedor}>
                {cont.tipo} - {cont.capacidad}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="centroDistribucion" className="form-label">
            Centro de Distribución de destino
          </label>
          <select
            id="centroDistribucion"
            className="form-control"
            value={distributionCenter}
            onChange={(e) => setDistributionCenter(e.target.value)}
            required
          >
            <option value="">Seleccione un centro de distribución</option>
            {availableCedis.map((cedis) => (
              <option key={cedis.idCedis} value={cedis.idCedis}>
                {cedis.name} - {cedis.address}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-success">
          Finalizar Pedido
        </button>
        <button type="button" className="btn btn-secondary ms-2" onClick={onBack}>
          Volver
        </button>
      </form>
    </section>
  );
};

// PropTypes para validar las props recibidas
OrderDetailFormComp.propTypes = {
  selectedProducts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      botana: PropTypes.string.isRequired,
      imagen: PropTypes.string.isRequired,
      cantidadAgregada: PropTypes.number.isRequired,
    })
  ).isRequired,
  onBack: PropTypes.func.isRequired,
  clearSelectedProducts: PropTypes.func.isRequired,
};

export default OrderDetailFormComp;