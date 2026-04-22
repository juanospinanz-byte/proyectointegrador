import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductoDetalle.css';

function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio);
}

function ProductoDetalle({ agregarAlCarrito }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const respuesta = await fetch(`http://localhost:5000/api/productos/${id}`);
        if (!respuesta.ok) {
          throw new Error('Producto no encontrado');
        }
        const datos = await respuesta.json();
        setProducto(datos);
        setCargando(false);
      } catch (err) {
        console.error('Error cargando producto:', err);
        setError('No se pudo cargar el producto. Verifica que el backend esté encendido.');
        setCargando(false);
      }
    };

    cargarProducto();
  }, [id]);

  if (cargando) {
    return (
      <div className="detalle-container">
        <div className="detalle-cargando">
          <div className="spinner"></div>
          <p>Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="detalle-container">
        <div className="detalle-error">
          <span className="error-icono-grande"></span>
          <h2>Producto no encontrado</h2>
          <p>{error || 'El producto que buscas no existe o ya no está disponible.'}</p>
          <button className="detalle-btn-volver" onClick={() => navigate('/')}>
            ← Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="detalle-container">
      {/* Botón volver */}
      <button className="detalle-breadcrumb" onClick={() => navigate('/')}>
        ← Volver a productos
      </button>

      <div className="detalle-contenido">
        {/* Imagen del producto */}
        <div className="detalle-imagen-lado">
          <div className="detalle-imagen-wrapper">
            {!imgError ? (
              <img
                src={producto.imagen_url}
                alt={producto.nombre}
                className="detalle-imagen"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="detalle-imagen-placeholder">
                <span></span>
                <p>Imagen no disponible</p>
              </div>
            )}
          </div>
        </div>

        {/* Info del producto */}
        <div className="detalle-info-lado">
          <div className="detalle-badge-container">
            <span className="detalle-badge-disponible"> Disponible</span>
          </div>

          <h1 className="detalle-nombre">{producto.nombre}</h1>

          <div className="detalle-precio-container">
            <span className="detalle-precio">{formatearPrecio(producto.precio)}</span>
            <span className="detalle-precio-nota">Precio por unidad (IVA incluido)</span>
          </div>

          <div className="detalle-separador"></div>

          <div className="detalle-descripcion-section">
            <h3 className="detalle-subtitulo">Descripción del producto</h3>
            <p className="detalle-descripcion">{producto.descripcion}</p>
          </div>

          <div className="detalle-separador"></div>

          <div className="detalle-caracteristicas">
            <h3 className="detalle-subtitulo">Características</h3>
            <ul className="detalle-lista">
              {(() => {
                try {
                  const items = typeof producto.caracteristicas === 'string'
                    ? JSON.parse(producto.caracteristicas)
                    : producto.caracteristicas;
                  if (Array.isArray(items)) {
                    return items.map((item, index) => (
                      <li key={index}>
                        <span className="lista-icono-label">{item.icono}</span> {item.texto}
                      </li>
                    ));
                  }
                } catch (e) {
                  return <li>Sin características disponibles</li>;
                }
                return <li>Sin características disponibles</li>;
              })()}
            </ul>
          </div>

          <div className="detalle-acciones">
            <button
              className={`detalle-btn-contactar ${producto._agregado ? 'detalle-btn-agregado' : ''}`}
              onClick={() => {
                if (agregarAlCarrito) {
                  const ok = agregarAlCarrito(producto);
                  if (ok) {
                    setProducto(prev => ({ ...prev, _agregado: true }));
                    setTimeout(() => setProducto(prev => ({ ...prev, _agregado: false })), 1500);
                  }
                }
              }}
            >
              {producto._agregado ? '✓ Agregado al carrito' : '🛒 Agregar al carrito'}
            </button>
            <button className="detalle-btn-volver-secundario" onClick={() => navigate('/')}>
              ← Volver a productos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;
