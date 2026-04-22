import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Carrito.css';

function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio);
}

function Carrito({ carrito, actualizarCantidad, eliminarDelCarrito }) {
  const navigate = useNavigate();

  const calcularSubtotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  if (carrito.length === 0) {
    return (
      <div className="carrito-container">
        <div className="carrito-vacio">
          <div className="carrito-vacio-icono">🛒</div>
          <h2>Tu carrito está vacío</h2>
          <p>Aún no has agregado productos a tu carrito de compras.</p>
          <button className="carrito-btn-comprar" onClick={() => navigate('/')}>
            Ver productos disponibles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="carrito-container">
      <div className="carrito-header">
        <button className="carrito-breadcrumb" onClick={() => navigate('/')}>
          ← Seguir comprando
        </button>
        <h1 className="carrito-titulo">Mi Carrito</h1>
        <p className="carrito-subtitulo">
          {totalItems} {totalItems === 1 ? 'producto' : 'productos'} en tu carrito
        </p>
      </div>

      <div className="carrito-layout">
        {/* Lista de productos */}
        <div className="carrito-productos">
          {carrito.map((item) => (
            <div className="carrito-item" key={item.id}>
              <div className="carrito-item-imagen">
                <img
                  src={item.imagen_url}
                  alt={item.nombre}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<span class="carrito-item-placeholder">📦</span>';
                  }}
                />
              </div>

              <div className="carrito-item-info">
                <h3 className="carrito-item-nombre">{item.nombre}</h3>
                <span className="carrito-item-precio-unit">
                  {formatearPrecio(item.precio)} c/u
                </span>
              </div>

              <div className="carrito-item-cantidad">
                <button
                  className="cantidad-btn"
                  onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                  disabled={item.cantidad <= 1}
                >
                  −
                </button>
                <span className="cantidad-numero">{item.cantidad}</span>
                <button
                  className="cantidad-btn"
                  onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                >
                  +
                </button>
              </div>

              <div className="carrito-item-subtotal">
                <span className="subtotal-label">Subtotal</span>
                <span className="subtotal-valor">{formatearPrecio(item.precio * item.cantidad)}</span>
              </div>

              <button
                className="carrito-item-eliminar"
                onClick={() => eliminarDelCarrito(item.id)}
                title="Eliminar del carrito"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="carrito-resumen">
          <div className="resumen-card">
            <h3 className="resumen-titulo">Resumen del pedido</h3>

            <div className="resumen-lineas">
              {carrito.map((item) => (
                <div className="resumen-linea" key={item.id}>
                  <span className="resumen-linea-nombre">
                    {item.nombre} <span className="resumen-linea-qty">×{item.cantidad}</span>
                  </span>
                  <span className="resumen-linea-precio">{formatearPrecio(item.precio * item.cantidad)}</span>
                </div>
              ))}
            </div>

            <div className="resumen-separador"></div>

            <div className="resumen-total">
              <span>Total</span>
              <span className="resumen-total-valor">{formatearPrecio(calcularSubtotal())}</span>
            </div>

            <p className="resumen-nota">IVA incluido en todos los precios</p>

            <button className="resumen-btn-seguir" onClick={() => navigate('/')}>
              ← Seguir comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carrito;
