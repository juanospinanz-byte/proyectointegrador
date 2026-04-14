import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const manejarLogin = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, contrasena }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        localStorage.setItem('gapToken', datos.token);
        localStorage.setItem('gapUsuarioNombre', datos.usuario.nombre);
        setError('');
        navigate('/');
      } else {
        setError(datos.mensaje || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error('Error conectando al backend:', err);
      setError('No se pudo conectar al servidor. Verifica que el backend esté encendido.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Bienvenido a GAP</h2>
        <p>Inicia sesión en tu cuenta</p>

        {error && <div className="error-mensaje">{error}</div>}

        <form onSubmit={manejarLogin} className="login-form">
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">Entrar</button>
        </form>

        <p className="login-footer">
          ¿No tienes una cuenta aún? <span onClick={() => navigate('/registro')} className="link-text">Regístrate</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
