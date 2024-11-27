import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import styles from "../../styles/styles-reporte.module.scss";

const Reportes = () => {
  const [contenedores, setContenedores] = useState([]);
  const [detalle, setDetalle] = useState(null);

  // Datos simulados
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
        nombre: "Contenedor Barcel",
        fechaIngreso: "2023-11-03T08:15:00Z",
        productos: [
          { descripcion: "Takis Fuego", cantidad: 50 },
          { descripcion: "Takis Crunchy", cantidad: 30 },
          { descripcion: "Rancheritos", cantidad: 40 },
          { descripcion: "Cheetos Bolitas", cantidad: 20 },
          { descripcion: "Ruffles Original", cantidad: 25 },
          { descripcion: "Doritos Nacho", cantidad: 35 },
          { descripcion: "Doritos Flaming Hot", cantidad: 20 },
          { descripcion: "Sabritas Adobadas", cantidad: 15 },
          { descripcion: "Churrumais", cantidad: 60 },
          { descripcion: "Chips Jalapeño", cantidad: 45 },
          { descripcion: "Doritos Dinamita", cantidad: 50 },
          { descripcion: "Paketaxo", cantidad: 30 },
          { descripcion: "Tostitos Salsa Verde", cantidad: 35 },
          { descripcion: "Takis Guacamole", cantidad: 25 },
          { descripcion: "Sabritones", cantidad: 40 },
          { descripcion: "Crujitos", cantidad: 55 },
          { descripcion: "Chip's BBQ", cantidad: 20 },
        ],
      },
      {
        id: "C004",
        nombre: "Contenedor C",
        fechaIngreso: "2023-11-04T14:00:00Z",
        productos: [
          { descripcion: "Producto C1", cantidad: 20 },
          { descripcion: "Producto C2", cantidad: 7 },
          { descripcion: "Producto C3", cantidad: 14 },
        ],
      },
      {
        id: "C005",
        nombre: "Contenedor D",
        fechaIngreso: "2023-11-05T09:00:00Z",
        productos: [
          { descripcion: "Producto D1", cantidad: 10 },
          { descripcion: "Producto D2", cantidad: 5 },
          { descripcion: "Producto D3", cantidad: 12 },
          { descripcion: "Producto D4", cantidad: 8 },
        ],
      },
    ];
  
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setContenedores(dummyData);
  };
  

  useEffect(() => {
    fetchContenedores();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const descargarPDFHistorico = () => {
    const doc = new jsPDF();
  
    // Encabezado estilizado
    doc.setFillColor(52, 152, 219); // Azul claro
    doc.rect(0, 0, 210, 30, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("Reporte Histórico de Contenedores", 105, 15, { align: "center" });
  
    // Información general
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 40);
  
    // Título de la tabla
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(52, 152, 219); // Azul claro
    doc.text("Detalles de Contenedores", 14, 50);
  
    // Tabla de contenedores
    const tableData = contenedores.map((contenedor, index) => [
      index + 1,
      contenedor.id,
      contenedor.nombre,
      formatDate(contenedor.fechaIngreso),
      contenedor.productos.length,
    ]);
  
    doc.autoTable({
      startY: 55,
      head: [["#", "ID Contenedor", "Nombre", "Fecha de Ingreso", "Total Productos"]],
      body: tableData,
      theme: "grid",
      styles: {
        fontSize: 10,
        textColor: 40,
        lineColor: 230,
      },
      headStyles: {
        fillColor: [41, 128, 185], // Azul oscuro
        textColor: 255,
        fontSize: 11,
      },
      bodyStyles: {
        fillColor: [250, 250, 250],
      },
      alternateRowStyles: {
        fillColor: [240, 248, 255], // Azul claro
      },
    });
  
    // Línea decorativa al final
    const pageHeight = doc.internal.pageSize.height;
    doc.setDrawColor(52, 152, 219);
    doc.line(14, pageHeight - 20, 196, pageHeight - 20);
  
    // Pie de página
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `Generado el: ${new Date().toLocaleDateString()}`,
      14,
      pageHeight - 10
    );
    doc.text("Reporte histórico generado automáticamente.", 196, pageHeight - 10, {
      align: "right",
    });
  
    // Guardar el PDF
    doc.save("HistoricoContenedores.pdf");
  };
  

  const descargarPDFContenedor = (contenedor) => {
    const doc = new jsPDF();
  
    // Encabezado con fondo de color
    doc.setFillColor(52, 152, 219); // Azul claro
    doc.rect(0, 0, 210, 30, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("Reporte de Contenedor", 105, 15, { align: "center" });
  
    // Información general del contenedor
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);
  
    // Contenedor de información con rectángulo
    doc.setDrawColor(230, 230, 230);
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(14, 40, 182, 30, 3, 3, "F");
  
    doc.text(`Nombre: ${contenedor.nombre}`, 20, 50);
    doc.text(`ID Contenedor: ${contenedor.id}`, 20, 56);
    doc.text(`Fecha de Ingreso: ${formatDate(contenedor.fechaIngreso)}`, 20, 62);
  
    // Título de la tabla
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(52, 152, 219); // Azul claro
    doc.text("Productos en el Contenedor", 14, 80);
  
    // Tabla de productos
    const tableData = contenedor.productos.map((producto, index) => [
      index + 1,
      producto.descripcion,
      producto.cantidad,
    ]);
  
    doc.autoTable({
      startY: 85,
      head: [["#", "Producto", "Cantidad"]],
      body: tableData,
      theme: "grid",
      styles: {
        fontSize: 10,
        textColor: 40,
        lineColor: 230,
      },
      headStyles: {
        fillColor: [41, 128, 185], // Azul más oscuro
        textColor: 255,
        fontSize: 11,
      },
      bodyStyles: {
        fillColor: [250, 250, 250],
      },
      alternateRowStyles: {
        fillColor: [240, 248, 255], // Azul claro
      },
    });
  
    // Línea decorativa al final
    const pageHeight = doc.internal.pageSize.height;
    doc.setDrawColor(52, 152, 219);
    doc.line(14, pageHeight - 20, 196, pageHeight - 20);
  
    // Pie de página
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `Generado el: ${new Date().toLocaleDateString()}`,
      14,
      pageHeight - 10
    );
    doc.text("Reporte generado automáticamente.", 196, pageHeight - 10, {
      align: "right",
    });
  
    // Guardar el PDF
    doc.save(`Contenedor_${contenedor.id}.pdf`);
  };
  
  

  const abrirDetalle = (contenedor) => {
    document.body.style.overflow = "hidden"; // Desactiva el scroll del fondo
    setDetalle(contenedor);
  };
  
  const cerrarDetalle = () => {
    document.body.style.overflow = "auto"; // Reactiva el scroll del fondo
    setDetalle(null);
  };
  
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
              <th>ID</th>
              <th>Nombre</th>
              <th>Fecha de Ingreso</th>
              <th>Total Productos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contenedores.map((contenedor, index) => (
              <tr key={contenedor.id}>
                <td>{index + 1}</td>
                <td>{contenedor.id}</td>
                <td>{contenedor.nombre}</td>
                <td>{formatDate(contenedor.fechaIngreso)}</td>
                <td>{contenedor.productos.length}</td>
                <td>
                  <div className={styles.acciones}>
                    <button className={styles.botonDetalle} onClick={() => abrirDetalle(contenedor)}>
                      Ver Detalle
                    </button>
                    <button className={styles.botonDescargar} onClick={() => descargarPDFContenedor(contenedor)}>
                      Descargar PDF
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {detalle && (
        <div className={styles.detalleOverlay}>
          <div className={styles.detalleModal}>
            <h3>Detalle del Contenedor</h3>
            <div className={styles.detalleContent}>
              <div className={styles.detalleGrid}>
                <div className={styles.detalleItem}>
                  <span>ID:</span>
                  <p>{detalle.id}</p>
                </div>
                <div className={styles.detalleItem}>
                  <span>Nombre:</span>
                  <p>{detalle.nombre}</p>
                </div>
                <div className={styles.detalleItem}>
                  <span>Fecha:</span>
                  <p>{formatDate(detalle.fechaIngreso)}</p>
                </div>
              </div>
              <h4>Productos:</h4>
              <ul>
                {detalle.productos.map((producto, index) => (
                  <li key={index}>
                    <span>{producto.descripcion}</span> - Cantidad: {producto.cantidad}
                  </li>
                ))}
              </ul>
            </div>
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
