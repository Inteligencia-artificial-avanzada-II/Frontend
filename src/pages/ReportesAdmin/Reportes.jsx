import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import styles from "../../styles/styles-reporte.module.scss";


/**
 * Componente principal para gestionar y generar reportes de contenedores.
 * Incluye funcionalidades para descargar reportes en PDF y visualizar detalles de cada contenedor.
 */
const Reportes = () => {
  const [contenedores, setContenedores] = useState([]);
  const [detalle, setDetalle] = useState(null);

   /**
   * Simula la obtención de datos desde una API con datos dummy.
   * Realiza un retraso artificial de 1 segundo antes de establecer los datos.
   */
  const fetchContenedores = async () => {
    const dummyData = [
      {
        id: "1",
        nombre: "Contenedor 1",
        fechaIngreso: "2024-11-27T14:08",
        productos: [
          { descripcion: "Papas Barcel Toreadas PC SP 1p 170g FLOW BAR", cantidad: 650 },
          { descripcion: "Papas Barcel Toreadas PC 1p 170g FLOW BAR", cantidad: 450 },
          { descripcion: "Big Mix Queso 1p 185g FLOW BAR", cantidad: 350 },
          { descripcion: "Big Mix Queso 1p 200g FLOW BAR", cantidad: 650 },
          { descripcion: "Takis Fuego 1p 80g FLOW BAR", cantidad: 350 },
          { descripcion: "Takis Fuego PC 1p90g FLOW BAR", cantidad: 200 },
          { descripcion: "Chips Jalapeno 1p 170g FLOW BAR", cantidad: 150 },
          { descripcion: "Chips Jalapeno Pc 1p 150g FLOW BAR", cantidad: 100 },
          { descripcion: "Chips Jalapeno 1p 100g FLOW BAR", cantidad: 100 },
        ],
      },
      {
        id: "3",
        nombre: "Contenedor 3",
        fechaIngreso: "2024-11-27T14:10",
        productos: [
          { descripcion: "Chips Sal 1p 170g FLOW BAR", cantidad: 450 },
          { descripcion: "Hot Nuts Pc 1p 200g FLOW BAR", cantidad: 600 },
          { descripcion: "Karameladas Pop 1p 45g FLOW BAR", cantidad: 150 },
          { descripcion: "GoldenNuts Enchilado 1p 78g CF FLOW BAR", cantidad: 150 },
          { descripcion: "Karameladas Pop 1p 120g FLOW BAR", cantidad: 300 },
          { descripcion: "Karameladas Pop 1p 110g FLOW BAR", cantidad: 250 },
          { descripcion: "Big Mix Fuego 1p 185g FLOW BA", cantidad: 200 },
          { descripcion: "Karameladas Pop 1p 110g FLOW BAR", cantidad: 250 },
          { descripcion: "Chips Papatinas Chillix 1p 90g FLOW BAR", cantidad: 250 },
          { descripcion: "Chicharron De Cerdo 1p 30g FLOW BAR", cantidad: 250 },
        ],
      },
      {
        id: "5",
        nombre: " Contenedor 5",
        fechaIngreso: "2024-11-27T14:16",
        productos: [
          { descripcion: "Runners Original 1p 72g FLOW BAR", cantidad: 300 },
          { descripcion: "Papas Barcel Toreadas PC SP 1p 170g FLOW BAR", cantidad: 200 },
          { descripcion: "Chips Jalapeno 1p 62g CP FLOW BAR", cantidad: 248 },
          { descripcion: "Golden Nuts Enchilado Pc 1p 150g FLOW BAR", cantidad: 1170 },
          { descripcion: "Golden Nuts Enchilado 1p 100g FLOW BAR", cantidad: 150 },
          { descripcion: "Chips Jalapeno 1p 240g FLOW BAR", cantidad: 250 },
          { descripcion: "Chips Jalapeno 1p 170g FLOW BAR", cantidad: 150 },
          { descripcion: "Wapas Nuevo Queso 1p 52g PC TIRA BAR", cantidad: 250 },
          { descripcion: "Chips Fuego Pc 1p 160g FLOW BAR", cantidad: 150 },
          { descripcion: "Chips Sal Pc 1p 160g FLOW BAR", cantidad: 190 },
          { descripcion: "Chips Sal 1p 62g CP FLOW BAR", cantidad: 190 },
          { descripcion: "Chips Sal Sp 1p 60g FLOW BAR", cantidad: 190 },
        ],
      },
      {
        id: "7",
        nombre: "Contenedor 7",
        fechaIngreso: "2024-11-27T14:18",
        productos: [
          { descripcion: "Big Mix Queso 1p 185g FLOW BAR", cantidad: 190 },
          { descripcion: "Takis Fuego 20pct Mas Picante 1p 70g FLOW BAR", cantidad: 190 },
          { descripcion: "Takis Fuego 1p 56g FLOW BAR", cantidad: 191 },
          { descripcion: "Takis Fuego PC 1p90g FLOW BAR", cantidad: 150 },
          { descripcion: "Takis Fuego NE 1p 65g FLOW BAR", cantidad: 190 },
          { descripcion: "Chips Jalapeno Sp 1p 60g FLOW BAR", cantidad: 150 },
          { descripcion: "Chips Jalapeno Pc 1p 160g FLOW BAR", cantidad: 190 },
          { descripcion: "Chips Jalapeno 1p 62g CP FLOW BAR", cantidad: 190 },
          { descripcion: "Chips Jalapeno NE 1p 46g FLOW BARR", cantidad: 150 },
          { descripcion: "Golden Nuts Enchilado 1p 100g FLOW BAR", cantidad: 250 },
        ],
      },
      {
        id: "6",
        nombre: "Contenedor 6",
        fechaIngreso: "2024-11-27T14:14",
        productos: [
          { descripcion: "Papas Barcel Toreadas PC 1p 170g FLOW BAR", cantidad: 701 },
          { descripcion: "Runners Original 1p 72g FLOW BAR", cantidad: 801 },
          { descripcion: "Big Mix Queso 1p 185g FLOW BAR", cantidad: 901 },
          { descripcion: "Takis Fuego 1p 200g FLOW BAR4", cantidad: 501 },
          { descripcion: "Chips Jalapeno 1p 62g CP FLOW BAR", cantidad: 301 },
          { descripcion: "Golden Nuts Enchilado Pc 1p 150g FLOW BAR", cantidad: 641 },
          { descripcion: "Wapas Nuevo Queso 1p 52g PC TIRA BAR", cantidad: 351 },
        ],
      },

      {
        id: "8",
        nombre: "Contenedor 8",
        fechaIngreso: "2024-11-27T14:20",
        productos: [
          { descripcion: "Runners Pc 1p 80g FLOW BAR", cantidad: 190 },
          { descripcion: "Runners 1p 200g FLOW BAR", cantidad: 190 },
          { descripcion: "Runners Pc 1p 280g FLOW BAR", cantidad: 191 },
          { descripcion: "Hot Nuts Original 1p 160g FLOW BAR", cantidad: 150 },
          { descripcion: "Hot Nuts Original 1p 82g FLOW BAR", cantidad: 190 },
          { descripcion: "Hot Nuts Original 1p 100g FLOW BAR", cantidad: 150 },
          { descripcion: "Big Mix Fuego 1p 185g FLOW BAR", cantidad: 190 },
          { descripcion: "Golden Nuts Salado 1p 110g FLOW BAR", cantidad: 190 },
          { descripcion: "Golden Nuts Salado Nvo 1p 78g FLOW BAR", cantidad: 150 },
          { descripcion: "Kiyakis 1p 120g FLOW BAR", cantidad: 250 },
          { descripcion: "Kiyakis Nvo Pc 1p 95g FLOW BAR", cantidad: 190 },
          { descripcion: "Kiyakis Nvo Pc 1p 50g FLOW BAR", cantidad: 150 },
          { descripcion: "GoldenNuts Salado 1p 78g CF FLOW BAR", cantidad: 250 },
          { descripcion: "Chips Papatinas Chillix PC 1p 31g FLOW BAR", cantidad: 150 },
          { descripcion: "Chicharron De Cerdo 1p 30g FLOW BAR", cantidad: 250 },
        ],
      },
    ];
  
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setContenedores(dummyData);
  };
  
// Llama a la función `fetchContenedores` al cargar el componente.
  useEffect(() => {
    fetchContenedores();
  }, []);


    /**
   * Formatea una fecha en formato legible (dd/mm/aaaa).
   * - Fecha en formato ISO.
   * - Fecha formateada.
   */

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Genera y descarga un PDF con un resumen histórico de todos los contenedores.

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
  
  /**
   * Genera y descarga un PDF con los detalles de un contenedor específico.
   * - Contenedor seleccionado.
   */
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
  
  
   /**
   * Muestra el detalle de un contenedor en un modal.
   * - Contenedor seleccionado.
   */
  const abrirDetalle = (contenedor) => {
    document.body.style.overflow = "hidden"; // Desactiva el scroll del fondo
    setDetalle(contenedor);
  };
  
  // Se cierra el modal del detalle
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
