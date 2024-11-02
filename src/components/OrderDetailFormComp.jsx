import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import styles from "../styles/styles-orderdetailformcomp.module.scss";

const OrderDetailFormComp = ({ selectedProducts, onBack }) => {
    const [orderNumber, setOrderNumber] = useState("");
    const [vehicle, setVehicle] = useState("");
    const [container, setContainer] = useState("");
    const [distributionCenter, setDistributionCenter] = useState("");

    

    const handleSubmit = (e) => {
        e.preventDefault();

        // Construir el nombre completo a partir de los datos de userData
        const createdBy = localStorage.getItem('token')
        const modifiedBy = createdBy;

        const jsonFinal = {
            sqlData: {
                idContenedor: container || "Id del contenedor",
                idCamion: vehicle || "Id del camion",
                origen: "Página de pedido",
                idCedis: distributionCenter || "Id del cedis",
            },
            mongoData: {
                orderNumber: orderNumber || "string",
                createdBy: createdBy,
                modifiedBy: modifiedBy,
                creationDate: new Date().toISOString(),
                products: selectedProducts.map((product) => ({
                    itemCode: product.id?.toString() || "string",
                    itemDescription: product.nombre || "string",
                    originalOrderQuantity: product.cantidadAgregada || "number",
                    requestedQuantity: product.cantidadAgregada || "number",
                    assignedQuantity: product.cantidadAgregada || "number",
                    packedQuantity: product.cantidadAgregada || "number",
                    orderDetailStatus: "pending",
                    expirationDateComprobante: new Date().toISOString(),
                    barcode: `B-${Math.floor(Math.random() * 1000000)}`,
                    salePrice: (Math.random() * 100).toFixed(2),
                    creationDateDetail: new Date().toISOString(),
                    alternativeItemCodes: "N/A",
                    unitOfMeasure: "unit",
                })),
            },
        };

        console.log("JSON generado:", jsonFinal);

        Toastify({
            text: "Pedido finalizado",
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #4b33a8, #96c93d)",
                borderRadius: "2rem",
                textTransform: "uppercase",
                fontSize: ".75rem",
            },
            offset: {
                x: "1.5rem",
                y: "1.5rem",
            },
        }).showToast();
    };

    return (
        <section className="col-12">
            <h4 className="mb-4">Resumen de Pedido</h4>

            <div className={styles.horizontalScrollContainer}>
                {selectedProducts.map((product) => (
                    <div className={`card ${styles.card}`} key={product.id}>
                        <div className={styles.cardContent}>
                            <div className={styles.imageContainer}>
                                <img src={product.imagen} className="img-fluid" alt={product.nombre} />
                            </div>
                            <div className={styles.infoContainer}>
                                <h5 className={styles.cardTitle}>{product.nombre}</h5>
                                <p className={styles.cardText}>Cantidad: {product.cantidadAgregada}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                    <label htmlFor="numeroOrden" className="form-label">Número de Orden</label>
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

                <div className="mb-3">
                    <label htmlFor="vehiculo" className="form-label">Vehículo</label>
                    <select
                        id="vehiculo"
                        className="form-control"
                        value={vehicle}
                        onChange={(e) => setVehicle(e.target.value)}
                        required
                    >
                        <option value="">Seleccione un vehículo</option>
                        <option value="vehiculo1">Camión de Carga 1</option>
                        <option value="vehiculo2">Camión de Carga 2</option>
                        <option value="vehiculo3">Camión Refrigerado</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="contenedor" className="form-label">Contenedor</label>
                    <select
                        id="contenedor"
                        className="form-control"
                        value={container}
                        onChange={(e) => setContainer(e.target.value)}
                        required
                    >
                        <option value="">Seleccione un contenedor</option>
                        <option value="contenedor1">Contenedor Estándar</option>
                        <option value="contenedor2">Contenedor Refrigerado</option>
                        <option value="contenedor3">Contenedor de Carga Pesada</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="centroDistribucion" className="form-label">Centro de Distribución de destino</label>
                    <select
                        id="centroDistribucion"
                        className="form-control"
                        value={distributionCenter}
                        onChange={(e) => setDistributionCenter(e.target.value)}
                        required
                    >
                        <option value="">Seleccione un centro de distribución</option>
                        <option value="centro1">Centro de Distribución Norte</option>
                        <option value="centro2">Centro de Distribución Sur</option>
                        <option value="centro3">Centro de Distribución Este</option>
                        <option value="centro4">Centro de Distribución Oeste</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-success">Finalizar Pedido</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={onBack}>Volver</button>
            </form>
        </section>
    );
};

OrderDetailFormComp.propTypes = {
    selectedProducts: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            nombre: PropTypes.string.isRequired,
            imagen: PropTypes.string.isRequired,
            cantidadAgregada: PropTypes.number.isRequired,
        })
    ).isRequired,
    onBack: PropTypes.func.isRequired,
};

export default OrderDetailFormComp;
