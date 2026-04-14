import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Registro from './pages/Registro';
import Login from './pages/Login';
import logo from './logo.svg';
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
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>GAP</Link>
      </div>
      <div className='navbar-links'>
        <button className='nav-btn' onClick={() => navigate('/')}>Inicio</button>
        <button className='nav-btn'>Catálogo</button>

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

function Home() {
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1>Bienvenido a GAP</h1>
      <p>Insumos alimenticios para ganadería</p>
      <p style={{ fontSize: '16px', color: '#ccc' }}>
        Sales mineralizadas, palmiste, melaza, sal marina, azufre, calcio, fósforo.
      </p>
    </header>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
