import PropTypes from "prop-types";

import styles from "../styles/styles-orderdetailformcomp.module.scss";

const OrderDetailFormComp = ({ selectedProducts, onBack }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Pedido finalizado");
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

            {/* Formulario de Detalles del Pedido */}
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                    <label htmlFor="numeroOrden" className="form-label">Número de Orden</label>
                    <input
                        type="number"
                        className="form-control"
                        id="numeroOrden"
                        required
                        min="1"
                        placeholder="Ingrese el número de orden"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="vehiculo" className="form-label">Vehículo</label>
                    <select id="vehiculo" className="form-control" required>
                        <option value="">Seleccione un vehículo</option>
                        <option value="vehiculo1">Camión de Carga 1</option>
                        <option value="vehiculo2">Camión de Carga 2</option>
                        <option value="vehiculo3">Camión Refrigerado</option>
                        {/* Agrega más opciones según sea necesario */}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="contenedor" className="form-label">Contenedor</label>
                    <select id="contenedor" className="form-control" required>
                        <option value="">Seleccione un contenedor</option>
                        <option value="contenedor1">Contenedor Estándar</option>
                        <option value="contenedor2">Contenedor Refrigerado</option>
                        <option value="contenedor3">Contenedor de Carga Pesada</option>
                        {/* Agrega más opciones según sea necesario */}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="centroDistribucion" className="form-label">Centro de Distribución de destino</label>
                    <select id="centroDistribucion" className="form-control" required>
                        <option value="">Seleccione un centro de distribución</option>
                        <option value="centro1">Centro de Distribución Norte</option>
                        <option value="centro2">Centro de Distribución Sur</option>
                        <option value="centro3">Centro de Distribución Este</option>
                        <option value="centro4">Centro de Distribución Oeste</option>
                        {/* Agrega más opciones según sea necesario */}
                    </select>
                </div>

                <button type="submit" className="btn btn-success">Finalizar Pedido</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={onBack}>Volver</button>
            </form>
        </section>
    );
}

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
