import { useEffect, useState } from "react";
import styles from "../../styles/styles-orderpage.module.scss";
import OrderDetailFormComp from "../../components/OrderDetailFormComp";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { getEnvironmentURL } from "../../utils/getUrl";


/**
 * Componente principal para la página de pedidos.
 * Permite buscar, seleccionar productos, gestionar un carrito de compras, y continuar con el detalle del pedido.
 */
const OrderPage = () => {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]); // Productos filtrados
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda
  const [orderVisible, setOrderVisible] = useState(false); // Visibilidad de los productos
  const [selectedProducts, setSelectedProducts] = useState([]); // Selección de cada uno de ellos mediante el boton
  const [isOrderDetailVisible, setIsOrderDetailVisible] = useState(false); // Visibilidad del formulario de detalles del pedido.
  const [cantidad, setCantidad] = useState({}); // Cantidad por producto.

  /**
   * useEffect inicial para cargar los datos de productos desde la API.
   */
  useEffect(() => {
    // Cargar productos desde la API
    fetch(`${getEnvironmentURL()}/inventariofabrica/consultarTodos`)
      .then((response) => response.json())
      .then((data) => {
        // Agrupa los productos según su botana y estructura sus opciones.
        const groupedProducts = Object.values(
          data.reduce((acc, product) => {
            if (!acc[product.botana]) {
              acc[product.botana] = {
                botana: product.botana,
                id: product.id,
                imagen: product.imagen,
                opciones: [],
                selectedOption: "",
                selectedOptionId: null,
              };
            }
            acc[product.botana].opciones.push({
              descripcion: product.descripcion,
              id: product.id,
            });
            return acc;
          }, {})
        );
        setProductos(groupedProducts);
        setFilteredProductos(groupedProducts); // Inicializa productos filtrados
      });
  }, []);

  /**
   * Filtra los productos según el término ingresado en la barra de búsqueda.
   *  Evento de cambio en el input.
   */

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term) {
      const filtered = productos.filter((producto) =>
        producto.botana.toLowerCase().includes(term)
      );
      setFilteredProductos(filtered);
    } else {
      setFilteredProductos(productos); // Muestra todos si no hay búsqueda
    }
  };


   /**
   * Agrega un producto al carrito después de validar las opciones seleccionadas.
   * - Nombre de la botana.
   * - ID de la opción seleccionada.
   * - Descripción de la opción seleccionada.
   */

  const handleAddToOrder = (botana, selectedOptionId, selectedDescription) => {
    const cantidadSeleccionada = cantidad[botana] || 1;

    // Se hace uso de Toastify para notificar al usuario que el producto no ha sido agregado

    if (!selectedDescription || !selectedOptionId || cantidadSeleccionada <= 0) {
      Toastify({
        text: "Selecciona una descripción y una cantidad válida",
        duration: 1000,
        gravity: "top",
        position: "right",
        style: {
          background: "linear-gradient(to right, #800000, #901010)",
        },
      }).showToast();
      return;
    }

    // Verifica si el producto ya está en el carrito.

    const stringOptionId = selectedOptionId.toString();

    const productInOrder = selectedProducts.find((p) => p.id === stringOptionId);

    if (productInOrder) {
      // Si ya está en el carrito, actualiza la cantidad.
      const updatedOrder = selectedProducts.map((p) =>
        p.id === stringOptionId
          ? { ...p, cantidadAgregada: p.cantidadAgregada + cantidadSeleccionada }
          : p
      );
      setSelectedProducts(updatedOrder);
    } else {
      // Agrega el producto al carrito si no está.
      const productData = productos.find((producto) => producto.botana === botana);

      if (!productData) {
        console.error("Producto no encontrado:", botana);
        return;
      }

      setSelectedProducts([
        ...selectedProducts,
        {
          id: stringOptionId,
          botana,
          imagen: productData.imagen || "default-image-url.jpg",
          cantidadAgregada: cantidadSeleccionada,
          selectedOption: selectedDescription,
        },
      ]);
    }

    // Resetea las opciones seleccionadas y la cantidad.

    setProductos((prevProductos) =>
      prevProductos.map((producto) =>
        producto.botana === botana
          ? { ...producto, selectedOption: "", selectedOptionId: null }
          : producto
      )
    );
    setCantidad((prevCantidad) => ({ ...prevCantidad, [botana]: 1 }));

    // Se hace uso de Toastify para notificar al usuario que el producto no ha sido agregado

    Toastify({
      text: "Producto agregado",
      duration: 1000,
      gravity: "top",
      position: "right",
      style: {
        background: "linear-gradient(to right, #2e2ed1, #5353ec)",
        borderRadius: "2rem",
        textTransform: "uppercase",
        fontSize: ".75rem",
      },
    }).showToast();
  };

  /**
   * Maneja el cambio de opción seleccionada en el dropdown.
   * - Nombre de la botana.
   * - Valor seleccionado.
   * - ID de la opción seleccionada.
   */

  const handleDropdownChange = (botana, value, optionId) => {
    setProductos((prevProductos) =>
      prevProductos.map((producto) =>
        producto.botana === botana
          ? { ...producto, selectedOption: value, selectedOptionId: optionId }
          : producto
      )
    );
    setFilteredProductos((prevFiltered) =>
      prevFiltered.map((producto) =>
        producto.botana === botana
          ? { ...producto, selectedOption: value, selectedOptionId: optionId }
          : producto
      )
    );
  };

  /**
   * Actualiza la cantidad seleccionada para un producto.
   * - Nombre de la botana.
   * - Nueva cantidad seleccionada.
   */

  const handleQuantityChange = (botana, value) => {
    setCantidad((prevCantidad) => ({ ...prevCantidad, [botana]: parseInt(value, 10) || 1 }));
  };


    /**
   * Limpia el carrito y oculta la sección del pedido.
   */

  const handleCancelOrder = () => {
    setSelectedProducts([]);
    setOrderVisible(false);
  };

  // Continúa hacia el detalle del pedido.

  const handleContinueOrder = () => {
    setIsOrderDetailVisible(true);
  };

  //Alterna la visibilidad del carrito
  const toggleOrderVisibility = () => {
    setOrderVisible(!orderVisible);
  };

  // Limpia los productos seleccionados y cierra el formulario de detalles del pedido.

  const clearSelectedProducts = () => {
    setSelectedProducts([]);
    setIsOrderDetailVisible(false);
  };

  // Se hace el diseño de como estara estructurado dentro de nuestro front

  return (
    <div className="container-fluid">
      <div className="row">
        {!isOrderDetailVisible ? (
          <>
            <section className={`col-12 col-md-${orderVisible ? "9" : "12"} ${styles.mainContent}`}>
              <div className={`${styles.searchBar} d-flex mb-4`}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <i className="fas fa-search ms-2"></i>
              </div>
              <div className="row">
                {filteredProductos.map((producto) => (
                  <div className="col-12 col-md-6 col-lg-4 mb-4" key={producto.botana}>
                    <div className={`card ${styles.productCard}`}>
                      <div className="card-body">
                        <h5 className="card-title">{producto.botana}</h5>
                        <img className="img-fluid" src={producto.imagen} alt={producto.botana} />

                        <div className={styles.dropdownContainer}>
                          <label htmlFor={`dropdown-${producto.botana}`} className="form-label">
                            Descripción
                          </label>
                          <select
                            id={`dropdown-${producto.botana}`}
                            className="form-select"
                            value={producto.selectedOption || ""}
                            onChange={(e) => {
                              const selectedOptionId = producto.opciones.find(
                                (opt) => opt.descripcion === e.target.value
                              )?.id;
                              handleDropdownChange(
                                producto.botana,
                                e.target.value,
                                selectedOptionId
                              );
                            }}
                          >
                            <option value="">Seleccionar descripción</option>
                            {producto.opciones.map((option) => (
                              <option key={option.id} value={option.descripcion}>
                                {option.descripcion}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="mt-3">
                          <label htmlFor={`cantidad-${producto.botana}`} className="form-label">
                            Cantidad
                          </label>
                          <input
                            type="number"
                            id={`cantidad-${producto.botana}`}
                            className="form-control"
                            value={cantidad[producto.botana] || 1}
                            onChange={(e) => handleQuantityChange(producto.botana, e.target.value)}
                            min="1"
                          />
                        </div>

                        <button
                          className="btn btn-primary mt-3"
                          onClick={() =>
                            handleAddToOrder(
                              producto.botana,
                              producto.selectedOptionId,
                              producto.selectedOption
                            )
                          }
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {orderVisible && (
              <aside className={`col-12 col-md-3 bg-white p-2 ${styles.orderCart}`}>
                <button className={styles.hideOrderButton} onClick={toggleOrderVisibility}>
                  ➔
                </button>
                <h5 className="text-danger">ORDER</h5>
                <div className={`${styles.orderList}`}>
                  {selectedProducts.map((product) => (
                    <div key={product.id} className={styles.orderProduct}>
                      <img
                        src={product.imagen}
                        alt={product.botana}
                        className="img-fluid"
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          marginRight: "10px",
                        }}
                      />
                      <div className={styles.productInfo}>
                        <p style={{ fontWeight: "bold" }}>{product.botana}</p>
                        <p>Selección: {product.selectedOption || "No seleccionado"}</p>
                        <p>Cantidad agregada: {product.cantidadAgregada}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={`${styles.btnGroup} d-flex justify-content-center mt-3`}>
                  <button className="btn btn-secondary me-2" onClick={handleCancelOrder}>
                    Cancelar
                  </button>
                  <button className="btn btn-primary" onClick={handleContinueOrder}>
                    Continuar
                  </button>
                </div>
              </aside>
            )}

            {!orderVisible && (
              <div className={styles.showOrderTab} onClick={toggleOrderVisibility}>
                <span>⬅</span>
              </div>
            )}
          </>
        ) : (
          <OrderDetailFormComp
            selectedProducts={selectedProducts}
            onBack={() => setIsOrderDetailVisible(false)}
            clearSelectedProducts={clearSelectedProducts}
          />
        )}
      </div>
    </div>
  );
};

export default OrderPage;
