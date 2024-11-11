import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/styles-historico.module.scss";
import { getEnvironmentURL } from "../../utils/getUrl";

const HistoricPage = () => {
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
  const apiPostUrl = `${getEnvironmentURL()}/endpointDePost`; // Cambia esto al endpoint correspondiente.

  useEffect(() => {
    const fetchCedis = async () => {
      try {
        const response = await axios.get(`${apiUrlCedis}/consultarTodos`, {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        });
        setCedisData(response.data || []);
      } catch (error) {
        console.error("Error al obtener CEDIS:", error);
      }
    };

    const fetchContenedores = async () => {
      try {
        const response = await axios.get(`${apiUrlContenedor}/consultarTodos`, {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        });
        setContenedoresData(response.data || []);
      } catch (error) {
        console.error("Error al obtener contenedores:", error);
      }
    };

    const fetchVehiculos = async () => {
      try {
        const response = await axios.get(`${apiUrlCamion}/disponibles`, {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        });
        setVehiculosData(response.data || []);
      } catch (error) {
        console.error("Error al obtener vehículos:", error);
      }
    };

    fetchCedis();
    fetchContenedores();
    fetchVehiculos();
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const aplicarFiltros = async () => {
    try {
      const startDate = new Date(filtros.fechaInicio);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);

      const jsonPayload = {
        StartDate: startDate.toISOString(),
        EndDate: endDate.toISOString(),
        IdCedis: filtros.cedis ? parseInt(filtros.cedis, 10) : null,
        IdContenedor: filtros.contenedor ? parseInt(filtros.contenedor, 10) : null,
        IdVehiculo: filtros.vehiculo ? parseInt(filtros.vehiculo, 10) : null,
      };

      console.log("JSON enviado al servidor:", jsonPayload);

      const response = await axios.post(apiPostUrl, jsonPayload, {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      });

      setHistoricoData(response.data || []);
    } catch (error) {
      console.error("Error al aplicar filtros:", error);
    }
  };

  const abrirDetalle = (detalle) => {
    setDetalle(detalle);
  };

  const cerrarDetalle = () => {
    setDetalle(null);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Histórico de Pedidos</h2>

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
            {cedisData.map((cedis, index) => (
              <option key={cedis.idCedis} value={index + 1}>
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
            {contenedoresData.map((cont, index) => (
              <option key={cont.idContenedor} value={index + 1}>
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
            {vehiculosData.map((vehiculo, index) => (
              <option key={vehiculo.idCamion} value={index + 1}>
                {vehiculo.modelo}
              </option>
            ))}
          </select>
        </div>
        <button className={styles.botonAplicar} onClick={aplicarFiltros}>
          Aplicar Filtros
        </button>
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
            {historicoData.map((dato) => (
              <tr key={dato.id}>
                <td onClick={() => abrirDetalle(dato)}>{dato.fecha}</td>
                <td onClick={() => abrirDetalle(dato)}>{dato.contenedor}</td>
                <td onClick={() => abrirDetalle(dato)}>{dato.cedis}</td>
                <td onClick={() => abrirDetalle(dato)}>{dato.vehiculo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detalle && (
        <div className={styles.detalleOverlay}>
          <div className={styles.detalleModal}>
            <h3>Detalle del Pedido</h3>
            <p>
              <strong>Fecha:</strong> {detalle.fecha}
            </p>
            <p>
              <strong>Contenedor:</strong> {detalle.contenedor}
            </p>
            <p>
              <strong>CEDIS:</strong> {detalle.cedis}
            </p>
            <p>
              <strong>Vehículo:</strong> {detalle.vehiculo}
            </p>
            <h4>Productos</h4>
            <ul>
              {detalle.productos.map((prod) => (
                <li key={prod.id}>
                  {prod.descripcion} - {prod.cantidad} unidades
                </li>
              ))}
            </ul>
            <button onClick={cerrarDetalle}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoricPage;
