import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/styles-historico.module.scss";
import { getEnvironmentURL } from "../../utils/getUrl";

const HistoricPage = () => {
  const [historicoData, setHistoricoData] = useState([]);
  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFin: "",
    producto: "",
    contenedor: "",
  });
  const [productos, setProductos] = useState([]);
  const [contenedores, setContenedores] = useState([]);

  const apiUrlHistorico = `${getEnvironmentURL()}/historico`;

  useEffect(() => {
    const fetchHistoricoData = async () => {
      try {
        const response = await axios.get(`${apiUrlHistorico}/consultarTodos`, {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        });
        setHistoricoData(response.data);
      } catch (error) {
        console.error("Error al obtener datos históricos:", error);
      }
    };

    const fetchProductos = async () => {
      try {
        const response = await axios.get(`${getEnvironmentURL()}/productos/consultarTodos`, {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        });
        setProductos(response.data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    const fetchContenedores = async () => {
      try {
        const response = await axios.get(`${getEnvironmentURL()}/contenedor/consultarTodos`, {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        });
        setContenedores(response.data);
      } catch (error) {
        console.error("Error al obtener contenedores:", error);
      }
    };

    fetchHistoricoData();
    fetchProductos();
    fetchContenedores();
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const aplicarFiltros = () => {
    // Filtrar los datos del histórico según los filtros seleccionados
    let datosFiltrados = [...historicoData];

    if (filtros.fechaInicio) {
      datosFiltrados = datosFiltrados.filter((dato) => dato.fecha >= filtros.fechaInicio);
    }

    if (filtros.fechaFin) {
      datosFiltrados = datosFiltrados.filter((dato) => dato.fecha <= filtros.fechaFin);
    }

    if (filtros.producto) {
      datosFiltrados = datosFiltrados.filter((dato) =>
        dato.productos.some((prod) => prod.id === parseInt(filtros.producto))
      );
    }

    if (filtros.contenedor) {
      datosFiltrados = datosFiltrados.filter((dato) => dato.contenedorId === parseInt(filtros.contenedor));
    }

    setHistoricoData(datosFiltrados);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Histórico de Pedidos</h2>

      {/* Filtros */}
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
          <label htmlFor="fechaFin">Fecha Fin</label>
          <input
            type="date"
            id="fechaFin"
            name="fechaFin"
            value={filtros.fechaFin}
            onChange={handleFiltroChange}
          />
        </div>
        <div className={styles.filtroItem}>
          <label htmlFor="producto">Producto</label>
          <select id="producto" name="producto" value={filtros.producto} onChange={handleFiltroChange}>
            <option value="">Todos</option>
            {productos.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.descripcion}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.filtroItem}>
          <label htmlFor="contenedor">Contenedor</label>
          <select id="contenedor" name="contenedor" value={filtros.contenedor} onChange={handleFiltroChange}>
            <option value="">Todos</option>
            {contenedores.map((cont) => (
              <option key={cont.id} value={cont.id}>
                {cont.tipo}
              </option>
            ))}
          </select>
        </div>
        <button className={styles.botonAplicar} onClick={aplicarFiltros}>
          Aplicar Filtros
        </button>
      </div>

      {/* Tabla de histórico */}
      <div className={styles.tablaContainer}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Contenedor</th>
              <th>Productos</th>
              <th>Cantidad Total</th>
            </tr>
          </thead>
          <tbody>
            {historicoData.map((dato) => (
              <tr key={dato.id}>
                <td>{dato.fecha}</td>
                <td>{dato.contenedor}</td>
                <td>
                  {dato.productos.map((prod) => (
                    <p key={prod.id}>
                      {prod.descripcion} - {prod.cantidad}
                    </p>
                  ))}
                </td>
                <td>{dato.cantidadTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoricPage;
