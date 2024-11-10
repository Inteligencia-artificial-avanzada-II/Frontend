import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "../styles/styles-orderdetailformcomp.module.scss";
import { getEnvironmentURL } from "../utils/getUrl";

const OrderDetailFormComp = ({ selectedProducts, onBack, clearSelectedProducts }) => {
  const [orderNumber, setOrderNumber] = useState("");
  const [origenPedido, setOrigenPedido] = useState("");
  const [fechaSalida, setFechaSalida] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [container, setContainer] = useState("");
  const [distributionCenter, setDistributionCenter] = useState("");
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [availableContainers, setAvailableContainers] = useState([]);
  const [availableCedis, setAvailableCedis] = useState([]);

  const apiUrlContenedor = `${getEnvironmentURL()}/contenedor`;
  const apiUrlCamion = `${getEnvironmentURL()}/camion`;
  const apiUrlCedis = `${getEnvironmentURL()}/cedis`;
  const apiUrlOrden = `${getEnvironmentURL()}/orden`;

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Token ${token}` };
  };

  useEffect(() => {
    const fetchAvailableVehicles = async () => {
      try {
        const response = await axios.get(`${apiUrlCamion}/disponibles`, {
          headers: getAuthHeader(),
        });
        setAvailableVehicles(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error al obtener los camiones disponibles:", error);
        setAvailableVehicles([]);
      }
    };
    fetchAvailableVehicles();
  }, []);

  useEffect(() => {
    const fetchAvailableContainers = async () => {
      try {
        const response = await axios.get(`${apiUrlContenedor}/disponibles`, {
          headers: getAuthHeader(),
        });
        setAvailableContainers(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error al obtener los contenedores disponibles:", error);
        setAvailableContainers([]);
      }
    };
    fetchAvailableContainers();
  }, []);

  useEffect(() => {
    const fetchAvailableCedis = async () => {
      try {
        const response = await axios.get(`${apiUrlCedis}/consultarTodos`, {
          headers: getAuthHeader(),
        });
        setAvailableCedis(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error al obtener los centros de distribución (CEDIS):", error);
        setAvailableCedis([]);
      }
    };
    fetchAvailableCedis();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "¿Estás seguro/a?",
      icon: "question",
      html: `Se enviarán los productos agregados del carrito.`,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
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

        console.log(jsonFinal)

        try {
          await axios.post(`${apiUrlOrden}/crear`, jsonFinal, { headers: getAuthHeader() });
          Toastify({
            text: "Pedido finalizado",
            duration: 1000,
            gravity: "top",
            position: "right",
            style: {
              background: "linear-gradient(to right, white, blue)",
              borderRadius: "2rem",
              textTransform: "uppercase",
              fontSize: ".75rem",
            },
          }).showToast();

          setTimeout(() => {
            clearSelectedProducts();
          }, 1000);
        } catch (error) {
          console.error("Error al enviar el pedido:", error);
        }
      }
    });
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: Math.max(1, Math.min(selectedProducts.length, 5)), // Asegurar al menos 1 slide
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0",
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.max(1, Math.min(selectedProducts.length, 1)), // También asegúrate aquí
        },
      },
    ],
  };
  

  return (
    <section className="col-12">
      <h4 className="mb-4">Resumen de Pedido</h4>
      <div className={styles.horizontalScrollContainer}>
        <Slider {...carouselSettings}>
    {selectedProducts.map((product) => (
        <div className={styles.card} key={product.id}>
        <div className={styles.cardContent}>
            <div className={styles.imageContainer}>
            <img src={product.imagen} className="img-fluid" alt={product.botana} />
            </div>
            <div className={styles.infoContainer}>
            <h5 className={styles.cardTitle}>{product.botana}</h5>
            <p className={styles.cardText}>Cantidad: {product.cantidadAgregada}</p>
            <p className={styles.cardText}>
                 {product.selectedOption || "No seleccionado"}
            </p>
            </div>
        </div>
        </div>
    ))}
    </Slider>

      </div>

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
              min="1"
              placeholder="Ingrese el número de orden"
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
              placeholder="Ingrese el origen"
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
              min={new Date().toISOString().slice(0, 16)}
              placeholder="Ingrese la fecha y hora en la que saldrá el pedido"
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

OrderDetailFormComp.propTypes = {
  selectedProducts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      botana: PropTypes.string.isRequired,
      imagen: PropTypes.string.isRequired,
      cantidadAgregada: PropTypes.number.isRequired,
      selectedOption: PropTypes.string,
    })
  ).isRequired,
  onBack: PropTypes.func.isRequired,
  clearSelectedProducts: PropTypes.func.isRequired,
};

export default OrderDetailFormComp;
