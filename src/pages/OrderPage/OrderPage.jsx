import { useEffect, useState } from "react";
import styles from "../../styles/styles-orderpage.module.scss";
import OrderDetailFormComp from "../../components/OrderDetailFormComp";

const OrderPage = () => {
  const [productos, setProductos] = useState([]); // Estado para los productos
  const [orderVisible, setOrderVisible] = useState(false); // Estado para mostrar/ocultar la orden
  const [selectedProducts, setSelectedProducts] = useState([]); // Productos seleccionados en el carrito
  const [isOrderDetailVisible, setIsOrderDetailVisible] = useState(false);

  // Cargar los productos desde el archivo JSON
  useEffect(() => {
    fetch("/data/products.json") // Asegúrate de que esté en la carpeta 'public'
      .then((response) => response.json())
      .then((data) => setProductos(data));
  }, []);

  // Manejar la adición de productos al carrito
  const handleAddToOrder = (producto) => {
    setOrderVisible(true); // Muestra el carrito de la orden si se añade un producto

    const productInOrder = selectedProducts.find((p) => p.id === producto.id);
    if (productInOrder) {
      const updatedOrder = selectedProducts.map((p) => {
        if (p.id === producto.id) {
          return { ...p, cantidadAgregada: p.cantidadAgregada + 1 };
        }
        return p;
      });
      setSelectedProducts(updatedOrder);
    } else {
      setSelectedProducts([
        ...selectedProducts,
        { ...producto, cantidadAgregada: 1 },
      ]);
    }
  };

  // Actualizar la cantidad de productos en el carrito desde el input
  const handleQuantityChange = (id, cantidad) => {
    const updatedOrder = selectedProducts.map((p) => {
      if (p.id === id) {
        return { ...p, cantidadAgregada: cantidad };
      }
      return p;
    });
    setSelectedProducts(updatedOrder);
  };

  // Manejar el clic en el botón "Cancelar"
  const handleCancelOrder = () => {
    setSelectedProducts([]);
    setOrderVisible(false); // Oculta el carrito al cancelar la orden
  };

  const handleContinueOrder = () => {
    setIsOrderDetailVisible(true);
  };

  return (
    <div className={`container-fluid ${styles.container}`}>
      <div className="row">
        {!isOrderDetailVisible ? (
          <>
            <section className={`col-${orderVisible ? "10" : "12"} ${styles.mainContent}`}>
              <div className={`${styles.searchBar} d-flex mb-4`}>
                <input type="text" className="form-control" placeholder="Search..." />
                <i className="fas fa-search ms-2"></i>
              </div>
              <div className="row">
                {productos.map((producto) => (
                  <div className="col-12 col-md-6 col-lg-4 mb-4" key={producto.id}>
                    <div className={`card ${styles.productCard}`}>
                      <div className="card-body">
                        <h5 className="card-title">{producto.nombre}</h5>
                        <img className="img-fluid" src={producto.imagen} alt={producto.nombre} />
                        <p className="card-text">{producto.descripcion}</p>
                        <button className="btn btn-primary" onClick={() => handleAddToOrder(producto)}>
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            {orderVisible && (
              <aside className={`col-2 bg-white p-2 ${styles.orderCart}`}>
                <h5 className="text-danger">ORDER</h5>
                <div className={`${styles.orderList}`}>
                  {selectedProducts.map((product) => (
                    <div key={product.id} className={styles.orderProduct}>
                      <img className="img-fluid" src={product.imagen} alt={product.nombre} />
                      <div className={styles.orderProductInfo}>
                        <p>{product.nombre}</p>
                        <input
                          type="number"
                          min="1"
                          className="form-control"
                          value={product.cantidadAgregada}
                          onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.btnGroup}>
                  <button className="btn btn-secondary" onClick={handleCancelOrder}>
                    Cancelar
                  </button>
                  <button className="btn btn-primary" onClick={handleContinueOrder}>
                    Continuar
                  </button>
                </div>
              </aside>
            )}
          </>
        ) : (
          <OrderDetailFormComp onBack={() => setIsOrderDetailVisible(false)} />
        )}
      </div>
    </div >
  );
};

export default OrderPage;
