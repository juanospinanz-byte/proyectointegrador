import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Registro from './pages/Registro';
import Login from './pages/Login';
import ProductoDetalle from './pages/ProductoDetalle';
import './App.css';

function Navbar() {
  const navigate = useNavigate();
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
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '22px' }}>🐄 GAP</Link>
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
        <button className='nav-btn'>Contacto</button>
      </div>
    </nav>
  );
}

function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio);
}

function ProductoCard({ producto }) {
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

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
          <button className="producto-btn" onClick={() => navigate(`/producto/${producto.id}`)}>Ver detalles</button>
        </div>
      </div>
    </div>
  );
}

function Home() {
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
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>© 2026 GAP - Insumos Ganaderos. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
