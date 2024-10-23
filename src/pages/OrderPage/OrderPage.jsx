import React, { useEffect, useState } from 'react';
import styles from '../../styles/styles-orderpage.module.scss';

const OrderPage = () => {
  const [productos, setProductos] = useState([]); // Estado para los productos
  const [orderVisible, setOrderVisible] = useState(false); // Estado para mostrar/ocultar la orden
  const [selectedProducts, setSelectedProducts] = useState([]); // Productos seleccionados en el carrito

  // Cargar los productos desde el archivo JSON
  useEffect(() => {
    fetch('/data/products.json') // Asegúrate de que esté en la carpeta 'public'
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
      setSelectedProducts([...selectedProducts, { ...producto, cantidadAgregada: 1 }]);
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

  return (
    <div className={`container-fluid ${styles.container}`}>
      <div className="row">
        <aside className={`col-2 bg-light p-3 ${styles.sidebar}`}>
          <img src="/src/assets/bimboLogo.png" alt="Bimbo Logo" className={`img-fluid ${styles.logo}`} />
          <div className={`text-center mt-4 ${styles.userProfile}`}>
            <img src="/src/assets/profile-picture.png" alt="User Profile" className={`${styles.profileImg} rounded-circle`} />
            <p>Gavano</p>
            <span className="text-muted">HR Manager</span>
          </div>

          {/* Menú de navegación */}
          <nav className="mt-4">
            <ul className="nav flex-column">
              <li className="nav-item mb-3">
                <a className="nav-link active" href="#">
                  <i className="fas fa-tachometer-alt me-2"></i> Dashboard
                </a>
              </li>
              <li className="nav-item mb-3">
                <a className="nav-link" href="#">
                  <i className="fas fa-file-invoice-dollar me-2"></i> Finance
                </a>
              </li>
              <li className="nav-item mb-3">
                <a className="nav-link" href="#">
                  <i className="fas fa-users me-2"></i> Employees
                </a>
              </li>
              <li className="nav-item mb-3">
                <a className="nav-link" href="#">
                  <i className="fas fa-building me-2"></i> Company
                </a>
              </li>
              <li className="nav-item mb-3">
                <a className="nav-link" href="#">
                  <i className="fas fa-user-tie me-2"></i> Candidate
                </a>
              </li>
              <li className="nav-item mb-3">
                <a className="nav-link" href="#">
                  <i className="fas fa-calendar-alt me-2"></i> Calendar
                </a>
              </li>
              <li className="nav-item mb-3">
                <a className="nav-link" href="#">
                  <i className="fas fa-user me-2"></i> Profile
                </a>
              </li>
              <li className="nav-item mb-3">
                <a className="nav-link" href="#">
                  <i className="fas fa-cog me-2"></i> Setting
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Contenido principal */}
        <main className={`col-${orderVisible ? '8' : '10'} ${styles.mainContent}`}>
          <div className={`${styles.searchBar} d-flex mb-4`}>
            <input type="text" className="form-control" placeholder="Search..." />
            <i className="fas fa-search ms-2"></i>
          </div>

          {/* Lista de productos */}
          <div className="row">
            {productos.map((producto) => (
              <div className="col-12 col-md-6 col-lg-4 mb-4" key={producto.id}>
                <div className={`card ${styles.productCard}`}>
                  <div className="card-body">
                    <h5 className="card-title">{producto.nombre}</h5>
                    <img className="img-fluid" src={producto.imagen} alt={producto.nombre} />
                    <p className="card-text">{producto.descripcion}</p>
                    <p className="card-text">{producto.cantidad}</p>
                    <button className="btn btn-primary" onClick={() => handleAddToOrder(producto)}>
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Carrito de orden */}
        {orderVisible && (
          <aside className={`col-2 bg-white p-3 ${styles.orderCart}`}>
            <h5 className="text-danger">ORDER</h5>
            <div className={`${styles.orderList}`}>
              {selectedProducts.map((product) => (
                <div key={product.id} className={styles.orderProduct}>
                  <img className="img-fluid" src={product.imagen} alt={product.nombre} />
                  <div className={styles.orderProductInfo}>
                    <p>{product.nombre}</p>
                    <p className="cantidad">Cantidad: </p>
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

            {/* Botones de acción */}
            <div className={styles.btnGroup}>
            <button className="btn btn-secondary" onClick={handleCancelOrder}>
                Cancelar
            </button>
            <button className="btn btn-primary">
                Finalizar
            </button>
            </div>

          </aside>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
