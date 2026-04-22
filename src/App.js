import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Registro from './pages/Registro';
import Login from './pages/Login';
import ProductoDetalle from './pages/ProductoDetalle';
import Carrito from './pages/Carrito';
import './App.css';

// ========================================
// Utilidad para carrito en localStorage
// ========================================
function obtenerCarritoStorage() {
  try {
    const data = localStorage.getItem('gapCarrito');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function guardarCarritoStorage(carrito) {
  localStorage.setItem('gapCarrito', JSON.stringify(carrito));
}

// ========================================
// NAVBAR
// ========================================
function Navbar({ scrollToContacto, totalItemsCarrito }) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('gapToken');
  const usuarioNombre = localStorage.getItem('gapUsuarioNombre');

  const cerrarSesion = () => {
    localStorage.removeItem('gapToken');
    localStorage.removeItem('gapUsuarioNombre');
    navigate('/login');
  };

  return (
    <nav className='navbar'>
      <div className='navbar-brand'>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '22px' }}>GAP</Link>
      </div>
      <div className='navbar-links'>
        <button className='nav-btn' onClick={() => navigate('/')}>Inicio</button>

        {token ? (
          <>
            <span style={{ color: 'white', marginRight: '15px' }}>Hola, {usuarioNombre}</span>
            <button className='nav-btn' onClick={cerrarSesion}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <button className='nav-btn' onClick={() => navigate('/login')}>Inicio de sesión</button>
            <button className='nav-btn' onClick={() => navigate('/registro')}>Crear cuenta</button>
          </>
        )}
        <button className='nav-btn' onClick={() => {
          if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => scrollToContacto && scrollToContacto(), 300);
          } else {
            scrollToContacto && scrollToContacto();
          }
        }}>Contacto</button>

        {/* Ícono del carrito */}
        <button className='nav-btn nav-carrito-btn' onClick={() => navigate('/carrito')}>
          <svg className="nav-carrito-icono" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {totalItemsCarrito > 0 && (
            <span className="nav-carrito-badge">{totalItemsCarrito}</span>
          )}
        </button>
      </div>
    </nav>
  );
}

// ========================================
// UTILIDAD FORMATEAR PRECIO
// ========================================
function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio);
}

// ========================================
// TARJETA DE PRODUCTO
// ========================================
function ProductoCard({ producto, agregarAlCarrito }) {
  const [imgError, setImgError] = useState(false);
  const [agregado, setAgregado] = useState(false);
  const navigate = useNavigate();

  const manejarAgregar = () => {
    const resultado = agregarAlCarrito(producto);
    if (resultado) {
      setAgregado(true);
      setTimeout(() => setAgregado(false), 1500);
    }
  };

  return (
    <div className="producto-card">
      <div className="producto-imagen-container">
        {!imgError ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="producto-imagen"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="producto-imagen-placeholder">
            <span>📦</span>
            <p>Imagen no disponible</p>
          </div>
        )}
        <div className="producto-badge">Disponible</div>
      </div>
      <div className="producto-info">
        <h3 className="producto-nombre">{producto.nombre}</h3>
        <p className="producto-descripcion">{producto.descripcion}</p>
        <div className="producto-footer">
          <span className="producto-precio">{formatearPrecio(producto.precio)}</span>
          <div className="producto-btns">
            <button className="producto-btn" onClick={() => navigate(`/producto/${producto.id}`)}>Ver detalles</button>
            <button
              className={`producto-btn-carrito ${agregado ? 'producto-btn-agregado' : ''}`}
              onClick={manejarAgregar}
            >
              {agregado ? '✓ Agregado' : '🛒 Agregar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================
// HOME
// ========================================
function Home({ contactoRef, agregarAlCarrito }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const respuesta = await fetch('http://localhost:5000/api/productos');
        if (!respuesta.ok) {
          throw new Error('Error al cargar productos');
        }
        const datos = await respuesta.json();
        setProductos(datos);
        setCargando(false);
      } catch (err) {
        console.error('Error cargando productos:', err);
        setError('No se pudieron cargar los productos. Verifica que el backend esté encendido.');
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  return (
    <main className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-titulo">
            Insumos alimenticios para ganadería
          </h1>
          <p className="hero-subtitulo">
            Sales mineralizadas, palmiste, melaza, sal marina, azufre, calcio, fósforo y mucho más.
          </p>
          <div className="hero-badges">
            <span className="hero-badge">Envío a todo Colombia</span>
            <span className="hero-badge">Productos certificados</span>
            <span className="hero-badge">Mejores precios</span>
          </div>
        </div>
      </section>

      {/* Sección de Productos */}
      <section className="productos-section">
        <div className="seccion-header">
          <h2 className="seccion-titulo">Productos Disponibles</h2>
          <p className="seccion-subtitulo">
            Descubre nuestros insumos de la más alta calidad para tu ganado
          </p>
          <div className="seccion-linea"></div>
        </div>

        {cargando && (
          <div className="productos-cargando">
            <div className="spinner"></div>
            <p>Cargando productos...</p>
          </div>
        )}

        {error && (
          <div className="productos-error">
            <span className="error-icono">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {!cargando && !error && productos.length === 0 && (
          <div className="productos-vacio">
            <p>No hay productos disponibles en este momento.</p>
          </div>
        )}

        {!cargando && !error && productos.length > 0 && (
          <div className="productos-grid">
            {productos.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} agregarAlCarrito={agregarAlCarrito} />
            ))}
          </div>
        )}
      </section>

      {/* Sección de Contacto */}
      <section className="contacto-section" ref={contactoRef} id="contacto">
        <div className="seccion-header">
          <h2 className="seccion-titulo">Contacto</h2>
          <p className="seccion-subtitulo">
            Conócenos, visítanos y descubre todo lo que tenemos para tu ganado
          </p>
          <div className="seccion-linea"></div>
        </div>

        <div className="contacto-grid">
          {/* Horario de atención */}
          <div className="contacto-card contacto-horario-card">
            <h3 className="contacto-card-titulo">
              Horario de Atención
            </h3>
            <div className="contacto-imagen-wrapper">
              <img
                src="/horaio-gap.jpeg"
                alt="Horario de atención GAP"
                className="contacto-horario-img"
              />
            </div>
          </div>

          {/* Video de Instagram */}
          <div className="contacto-card contacto-video-card">
            <h3 className="contacto-card-titulo">
              <span className="contacto-card-icono">📍</span>
              Nuestra Ubicación
            </h3>
            <p className="contacto-video-desc">
              ¡Ya sabes dónde estamos! Ven, cotiza y lleva lo mejor para tu negocio o finca.
            </p>
            <div className="contacto-instagram-wrapper">
              <iframe
                src="https://www.instagram.com/reel/DXSAWyAgsnc/embed"
                className="contacto-instagram-iframe"
                frameBorder="0"
                scrolling="no"
                allowTransparency="true"
                allowFullScreen
                title="Reel de Instagram - Ubicación GAP"
              ></iframe>
            </div>
            <a
              href="https://www.instagram.com/reel/DXSAWyAgsnc/?igsh=MXR4bjc4eXd0N2c5MQ%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="contacto-instagram-link"
            >
              <span>Ver en Instagram</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        </div>

      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>© 2026 GAP - Insumos Ganaderos. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}

// ========================================
// APP CONTENT (con estado del carrito)
// ========================================
function AppContent() {
  const contactoRef = useRef(null);
  const [carrito, setCarrito] = useState(obtenerCarritoStorage());
  const navigate = useNavigate();

  // Sincronizar con localStorage
  useEffect(() => {
    guardarCarritoStorage(carrito);
  }, [carrito]);

  const scrollToContacto = () => {
    if (contactoRef.current) {
      contactoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const agregarAlCarrito = useCallback((producto) => {
    const token = localStorage.getItem('gapToken');
    if (!token) {
      alert('Debes iniciar sesión para agregar productos al carrito.');
      navigate('/login');
      return false;
    }

    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        return prev.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prev, {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen_url: producto.imagen_url,
          cantidad: 1
        }];
      }
    });
    return true;
  }, [navigate]);

  const eliminarDelCarrito = useCallback((productoId) => {
    setCarrito(prev => prev.filter(item => item.id !== productoId));
  }, []);

  const actualizarCantidad = useCallback((productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    setCarrito(prev =>
      prev.map(item =>
        item.id === productoId
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    );
  }, []);

  const totalItemsCarrito = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <div className="App">
      <Navbar scrollToContacto={scrollToContacto} totalItemsCarrito={totalItemsCarrito} />

      <Routes>
        <Route path="/" element={<Home contactoRef={contactoRef} agregarAlCarrito={agregarAlCarrito} />} />
        <Route path="/producto/:id" element={<ProductoDetalle agregarAlCarrito={agregarAlCarrito} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/carrito" element={
          <Carrito
            carrito={carrito}
            actualizarCantidad={actualizarCantidad}
            eliminarDelCarrito={eliminarDelCarrito}
          />
        } />
      </Routes>
    </div>
  );
}

// ========================================
// APP (Router wrapper)
// ========================================
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
