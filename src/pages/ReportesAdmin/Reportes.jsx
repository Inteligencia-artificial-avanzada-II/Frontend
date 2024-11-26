import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import styles from "../../styles/styles-reporte.module.scss";

const Reportes = () => {
  const [contenedores, setContenedores] = useState([]);
  const [detalle, setDetalle] = useState(null);

  // Simulación de datos dummy
  const fetchContenedores = async () => {
    const dummyData = [
      {
        id: "C001",
        nombre: "Contenedor A",
        fechaIngreso: "2023-11-01T10:30:00Z",
        productos: [
          { descripcion: "Producto A1", cantidad: 10 },
          { descripcion: "Producto A2", cantidad: 5 },
        ],
      },
      {
        id: "C002",
        nombre: "Contenedor B",
        fechaIngreso: "2023-11-02T12:45:00Z",
        productos: [
          { descripcion: "Producto B1", cantidad: 8 },
          { descripcion: "Producto B2", cantidad: 3 },
          { descripcion: "Producto B3", cantidad: 12 },
        ],
      },
      {
        id: "C003",
        nombre: "Contenedor C",
        fechaIngreso: "2023-11-03T08:15:00Z",
        productos: [
          { descripcion: "Producto C1", cantidad: 20 },
          { descripcion: "Producto C2", cantidad: 7 },
        ],
      },
    ];

    // Simula un retraso de 1 segundo
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setContenedores(dummyData); // Establece los datos dummy como estado
  };

  useEffect(() => {
    fetchContenedores();
  }, []);

  // Formateo de fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Descargar PDF Histórico
  const descargarPDFHistorico = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Reporte Histórico de Contenedores", 14, 20);
    doc.setFontSize(12);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableData = contenedores.map((contenedor, index) => [
      index + 1,
      contenedor.id,
      contenedor.nombre,
      formatDate(contenedor.fechaIngreso),
      contenedor.productos.length,
    ]);

    doc.autoTable({
      startY: 40,
      head: [["#", "ID Contenedor", "Nombre", "Fecha de Ingreso", "Total Productos"]],
      body: tableData,
    });

    doc.save("HistoricoContenedores.pdf");
  };

  // Descargar PDF por contenedor
  const descargarPDFContenedor = (contenedor) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`Reporte del Contenedor: ${contenedor.nombre}`, 14, 20);
    doc.setFontSize(12);
    doc.text(`ID Contenedor: ${contenedor.id}`, 14, 30);
    doc.text(`Fecha de Ingreso: ${formatDate(contenedor.fechaIngreso)}`, 14, 40);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 50);

    const tableData = contenedor.productos.map((producto, index) => [
      index + 1,
      producto.descripcion,
      producto.cantidad,
    ]);

    doc.autoTable({
      startY: 60,
      head: [["#", "Producto", "Cantidad"]],
      body: tableData,
    });

    doc.save(`Contenedor_${contenedor.id}.pdf`);
  };

  const abrirDetalle = (contenedor) => setDetalle(contenedor);

  const cerrarDetalle = () => setDetalle(null);

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Reporte de Contenedores</h2>

      <div className={styles.botonesContainer}>
        <button className={styles.botonDescargar} onClick={descargarPDFHistorico}>
          Descargar PDF Histórico
        </button>
      </div>

      <div className={styles.tablaContainer}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>#</th>
              <th>ID Contenedor</th>
              <th>Nombre</th>
              <th>Fecha de Ingreso</th>
              <th>Total Productos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contenedores.length > 0 ? (
              contenedores.map((contenedor, index) => (
                <tr key={contenedor.id}>
                  <td>{index + 1}</td>
                  <td>{contenedor.id}</td>
                  <td>{contenedor.nombre}</td>
                  <td>{formatDate(contenedor.fechaIngreso)}</td>
                  <td>{contenedor.productos.length}</td>
                  <td>
                    <button
                      className={styles.botonDetalle}
                      onClick={() => abrirDetalle(contenedor)}
                    >
                      Ver Detalle
                    </button>
                    <button
                      className={styles.botonDescargar}
                      onClick={() => descargarPDFContenedor(contenedor)}
                    >
                      Descargar PDF
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No hay datos disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {detalle && (
        <div className={styles.detalleOverlay}>
          <div className={styles.detalleModal}>
            <h3>Detalle del Contenedor</h3>
            <p>
              <strong>ID Contenedor:</strong> {detalle.id}
            </p>
            <p>
              <strong>Nombre:</strong> {detalle.nombre}
            </p>
            <p>
              <strong>Fecha de Ingreso:</strong> {formatDate(detalle.fechaIngreso)}
            </p>
            <h4>Productos</h4>
            <ul>
              {detalle.productos.map((producto, index) => (
                <li key={index}>
                  {producto.descripcion} - Cantidad: {producto.cantidad}
                </li>
              ))}
            </ul>
            <button className={styles.botonCerrar} onClick={cerrarDetalle}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reportes;
