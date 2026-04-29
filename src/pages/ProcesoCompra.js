import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProcesoCompra.css';

function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio);
}

function ProcesoCompra({ carrito, finalizarCompra }) {
  const navigate = useNavigate();
  const [compraFinalizada, setCompraFinalizada] = useState(false);
  const [productosConfirmados, setProductosConfirmados] = useState([]);
  const [datosCliente, setDatosCliente] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    numeroTarjeta: '',
    fechaVencimiento: '',
    codigoSeguridad: '',
  });

  const total = useMemo(
    () => carrito.reduce((acum, item) => acum + item.precio * item.cantidad, 0),
    [carrito]
  );

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatosCliente((prev) => ({ ...prev, [name]: value }));
  };

  const manejarConfirmacion = (e) => {
    e.preventDefault();

    if (
      !datosCliente.nombre ||
      !datosCliente.telefono ||
      !datosCliente.direccion ||
      !datosCliente.numeroTarjeta ||
      !datosCliente.fechaVencimiento ||
      !datosCliente.codigoSeguridad
    ) {
      alert('Completa todos los datos para continuar con la compra.');
      return;
    }

    setProductosConfirmados(carrito);
    setCompraFinalizada(true);
    finalizarCompra();
  };

  if (carrito.length === 0 && !compraFinalizada) {
    return (
      <div className="checkout-container">
        <h1 className="checkout-titulo">Proceso de compra</h1>
        <p className="checkout-vacio">No hay productos en tu carrito para comprar.</p>
        <button className="checkout-btn-secundario" onClick={() => navigate('/carrito')}>
          Volver al carrito
        </button>
      </div>
    );
  }

  if (compraFinalizada) {
    return (
      <div className="checkout-container">
        <h1 className="checkout-titulo">Compra confirmada</h1>
        <p className="checkout-texto">
          Gracias por tu compra, {datosCliente.nombre}. Estos son los productos confirmados:
        </p>

        <ul className="checkout-lista">
          {productosConfirmados.map((item) => (
            <li key={item.id} className="checkout-item">
              <span>{item.nombre} x{item.cantidad}</span>
              <strong>{formatearPrecio(item.precio * item.cantidad)}</strong>
            </li>
          ))}
        </ul>

        <p className="checkout-total">
          Total pagado: {
            formatearPrecio(
              productosConfirmados.reduce(
                (acum, item) => acum + item.precio * item.cantidad,
                0
              )
            )
          }
        </p>

        <button className="checkout-btn-primario" onClick={() => navigate('/')}>
          Ir a inicio
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1 className="checkout-titulo">Proceso de compra</h1>
      <p className="checkout-texto">Completa tus datos y confirma el pedido.</p>

      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={manejarConfirmacion}>
          <label>
            Nombre completo
            <input
              type="text"
              name="nombre"
              value={datosCliente.nombre}
              onChange={manejarCambio}
              placeholder="Escribe tu nombre"
            />
          </label>

          <label>
            Teléfono
            <input
              type="text"
              name="telefono"
              value={datosCliente.telefono}
              onChange={manejarCambio}
              placeholder="Ej: 3001234567"
            />
          </label>

          <label>
            Dirección de entrega
            <input
              type="text"
              name="direccion"
              value={datosCliente.direccion}
              onChange={manejarCambio}
              placeholder="Dirección completa"
            />
          </label>

          <label>
            Número de tarjeta
            <input
              type="text"
              name="numeroTarjeta"
              value={datosCliente.numeroTarjeta}
              onChange={manejarCambio}
              placeholder="Ej: 4111 1111 1111 1111"
              maxLength={19}
            />
          </label>

          <label>
            Fecha de vencimiento
            <input
              type="month"
              name="fechaVencimiento"
              value={datosCliente.fechaVencimiento}
              onChange={manejarCambio}
            />
          </label>

          <label>
            Código de seguridad
            <input
              type="password"
              name="codigoSeguridad"
              value={datosCliente.codigoSeguridad}
              onChange={manejarCambio}
              placeholder="Ej: 123"
              maxLength={4}
            />
          </label>

          <button type="submit" className="checkout-btn-primario">
            Confirmar compra
          </button>
        </form>

        <div className="checkout-resumen">
          <h2>Resumen</h2>
          {carrito.map((item) => (
            <div key={item.id} className="checkout-resumen-linea">
              <span>{item.nombre} x{item.cantidad}</span>
              <strong>{formatearPrecio(item.precio * item.cantidad)}</strong>
            </div>
          ))}
          <div className="checkout-resumen-total">
            <span>Total</span>
            <strong>{formatearPrecio(total)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProcesoCompra;
