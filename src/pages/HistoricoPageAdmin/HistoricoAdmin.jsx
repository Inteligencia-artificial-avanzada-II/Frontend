import React, { useState, useEffect } from "react";
import styles from "../../styles/styles-historico.module.scss";
import { getEnvironmentURL } from "../../utils/getUrl";

const HistoricoAdmin = () => {
  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    cedis: "",
    contenedor: "",
    vehiculo: "",
  });

  const [detalle, setDetalle] = useState(null);
  const [cedisData, setCedisData] = useState([]);
  const [contenedoresData, setContenedoresData] = useState([]);
  const [vehiculosData, setVehiculosData] = useState([]);
  const [historicoData, setHistoricoData] = useState([]);

  const apiUrlCedis = `${getEnvironmentURL()}/cedis`;
  const apiUrlContenedor = `${getEnvironmentURL()}/contenedor`;
  const apiUrlCamion = `${getEnvironmentURL()}/camion`;
  const apiGetUrl = `${getEnvironmentURL()}/orden/consultarConFiltros`;

  useEffect(() => {
    fetchInitialData();
    fetchCedis();
    fetchContenedores();
    fetchVehiculos();
  }, []);

  const fetchInitialData = async () => {
    try {
      const response = await fetch(`${apiGetUrl}`, {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      });
      const result = await response.json();
      setHistoricoData(processApiData(result.data || []));
    } catch (error) {
      console.error("Error al cargar datos iniciales:", error);
    }
  };

  const fetchCedis = async () => {
    try {
      const response = await fetch(`${apiUrlCedis}/consultarTodos`, {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setCedisData(data || []);
    } catch (error) {
      console.error("Error al obtener CEDIS:", error);
    }
  };

  const fetchContenedores = async () => {
    try {
      const response = await fetch(`${apiUrlContenedor}/consultarTodos`, {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setContenedoresData(data || []);
    } catch (error) {
      console.error("Error al obtener contenedores:", error);
    }
  };

  const fetchVehiculos = async () => {
    try {
      const response = await fetch(`${apiUrlCamion}/disponibles`, {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setVehiculosData(data || []);
    } catch (error) {
      console.error("Error al obtener vehículos:", error);
    }
  };

  const processApiData = (data) => {
    return data
      .filter((entry) => entry.mongoData?.creationDate)
      .map((entry) => ({
        fecha: formatDate(entry.mongoData?.creationDate),
        contenedor: entry.sqlData?.idContenedor || "",
        cedis: entry.sqlData?.idCedis || "",
        vehiculo: entry.sqlData?.idCamion || "",
        productos: entry.mongoData?.products
          ? entry.mongoData.products.map((prod) => ({
              descripcion: prod.itemDescription || "Producto desconocido",
              cantidad: prod.requestedQuantity || 0,
            }))
          : [],
      }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const aplicarFiltros = async () => {
    try {
      const params = new URLSearchParams();
      if (filtros.fechaInicio) {
        const startDate = new Date(filtros.fechaInicio).toISOString();
        const endDate = new Date(filtros.fechaInicio);
        endDate.setDate(endDate.getDate() + 1);
        params.append("startDate", startDate);
        params.append("endDate", endDate.toISOString());
      }
      if (filtros.cedis) params.append("idCedis", filtros.cedis);
      if (filtros.contenedor) params.append("idContenedor", filtros.contenedor);
      if (filtros.vehiculo) params.append("idCamion", filtros.vehiculo);

      const response = await fetch(`${apiGetUrl}?${params.toString()}`, {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Error al consultar la API");

      const result = await response.json();
      setHistoricoData(processApiData(result.data || []));
    } catch (error) {
      console.error("Error al aplicar filtros:", error);
      alert("Ocurrió un error al realizar la consulta. Por favor, intenta de nuevo.");
    }
  };

  const limpiarFiltros = () => {
    setFiltros({
      fechaInicio: "",
      cedis: "",
      contenedor: "",
      vehiculo: "",
    });
    fetchInitialData();
  };

  const abrirDetalle = (detalle) => {
    document.body.style.overflow = "hidden"; // Bloquear scroll
    setDetalle(detalle);
  };

  const cerrarDetalle = () => {
    document.body.style.overflow = ""; // Restaurar scroll
    setDetalle(null);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Histórico de Pedidos - Admin</h2>

      <div className={styles.filtros}>
        <div className={styles.filtroItem}>
          <label htmlFor="fechaInicio">Fecha Inicio</label>
          <input
            type="date"
            id="fechaInicio"
            name="fechaInicio"
            value={filtros.fechaInicio}
            onChange={handleFiltroChange}
          />
        </div>
        <div className={styles.filtroItem}>
          <label htmlFor="cedis">CEDIS</label>
          <select id="cedis" name="cedis" value={filtros.cedis} onChange={handleFiltroChange}>
            <option value="">Todos</option>
            {cedisData.map((cedis) => (
              <option key={cedis.idCedis} value={cedis.idCedis}>
                {cedis.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.filtroItem}>
          <label htmlFor="contenedor">Contenedor</label>
          <select
            id="contenedor"
            name="contenedor"
            value={filtros.contenedor}
            onChange={handleFiltroChange}
          >
            <option value="">Todos</option>
            {contenedoresData.map((cont) => (
              <option key={cont.idContenedor} value={cont.idContenedor}>
                {cont.tipo}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.filtroItem}>
          <label htmlFor="vehiculo">Vehículo</label>
          <select
            id="vehiculo"
            name="vehiculo"
            value={filtros.vehiculo}
            onChange={handleFiltroChange}
          >
            <option value="">Todos</option>
            {vehiculosData.map((vehiculo) => (
              <option key={vehiculo.idCamion} value={vehiculo.idCamion}>
                {vehiculo.modelo}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.botonesContainer}>
          <button className={styles.botonAplicar} onClick={aplicarFiltros}>
            Aplicar Filtros
          </button>
          <button className={styles.botonLimpiar} onClick={limpiarFiltros}>
            Limpiar Filtros
          </button>
        </div>
      </div>

      <div className={styles.tablaContainer}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Contenedor</th>
              <th>CEDIS</th>
              <th>Vehículo</th>
            </tr>
          </thead>
          <tbody>
            {historicoData.length > 0 ? (
              historicoData.map((dato, index) => (
                <tr key={index}>
                  <td onClick={() => abrirDetalle(dato)}>{dato.fecha}</td>
                  <td onClick={() => abrirDetalle(dato)}>{dato.contenedor || "Sin información"}</td>
                  <td onClick={() => abrirDetalle(dato)}>{dato.cedis || "Sin información"}</td>
                  <td onClick={() => abrirDetalle(dato)}>{dato.vehiculo || "Sin información"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No hay datos disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {detalle && (
        <div className={styles.detalleOverlay}>
          <div className={styles.detalleModal}>
            <h3>DETALLE DEL PEDIDO</h3>
            <div className={styles.detalleContent}>
              <div className={styles.detalleGrid}>
                <div className={styles.detalleItem}>
                  <span>Fecha:</span>
                  <p>{detalle.fecha}</p>
                </div>
                <div className={styles.detalleItem}>
                  <span>Contenedor:</span>
                  <p>{detalle.contenedor || "Sin información"}</p>
                </div>
                <div className={styles.detalleItem}>
                  <span>CEDIS:</span>
                  <p>{detalle.cedis || "Sin información"}</p>
                </div>
                <div className={styles.detalleItem}>
                  <span>Vehículo:</span>
                  <p>{detalle.vehiculo || "Sin información"}</p>
                </div>
              </div>
              <h4>Productos</h4>
              <ul>
                {detalle.productos.map((prod, idx) => (
                  <li key={idx}>
                    <span>{prod.descripcion}</span> - Cantidad: {prod.cantidad}
                  </li>
                ))}
              </ul>
            </div>

            <button onClick={cerrarDetalle}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoricoAdmin;
