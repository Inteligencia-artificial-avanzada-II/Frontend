import { useEffect, useState } from "react";
import styles from "../../styles/styles-orderpage.module.scss";
import OrderDetailFormComp from "../../components/OrderDetailFormComp";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const OrderPage = () => {
  const [productos, setProductos] = useState([]);
  const [orderVisible, setOrderVisible] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isOrderDetailVisible, setIsOrderDetailVisible] = useState(false);

  useEffect(() => {
    fetch("/data/products.json")
      .then((response) => response.json())
      .then((data) => setProductos(data));
  }, []);

  const handleAddToOrder = (producto) => {
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
      setSelectedProducts([...selectedProducts, { ...producto, cantidadAgregada: 1 }]);
    }

    Toastify({
      text: "Producto agregado",
      duration: 1000,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, 'white', 'blue')",
        borderRadius: "2rem",
        textTransform: "uppercase",
        fontSize: ".75rem"
      },
      offset: {
        x: "1.5rem",
        y: "1.5rem"
      },
    }).showToast();
  };

  const handleQuantityChange = (id, cantidad) => {
    const updatedOrder = selectedProducts.map((p) => {
      if (p.id === id) {
        return { ...p, cantidadAgregada: cantidad };
      }
      return p;
    });
    setSelectedProducts(updatedOrder);
  };

  const handleCancelOrder = () => {
    setSelectedProducts([]);
    setOrderVisible(false);
  };

  const handleContinueOrder = () => {
    setIsOrderDetailVisible(true);
  };

  const toggleOrderVisibility = () => {
    setOrderVisible(!orderVisible);
  };

  // Nueva función para limpiar productos seleccionados
  const clearSelectedProducts = () => {
    setSelectedProducts([]);
    setIsOrderDetailVisible(false);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {!isOrderDetailVisible ? (
          <>
            <section className={`col-12 col-md-${orderVisible ? "9" : "12"} ${styles.mainContent}`}>
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
              <aside className={`col-12 col-md-3 bg-white p-2 ${styles.orderCart}`}>
                <button className={styles.hideOrderButton} onClick={toggleOrderVisibility}>
                  ➔
                </button>
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
            clearSelectedProducts={clearSelectedProducts} // Pasa la función
          />
        )}
      </div>
    </div>
  );
};

export default OrderPage;
