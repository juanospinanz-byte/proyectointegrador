import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const navigate = useNavigate();

  const manejarRegistro = async (e) => {
    e.preventDefault();

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden. Por favor, intenta de nuevo.');
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:5000/api/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, email, contrasena }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        setMensajeExito('¡Cuenta creada correctamente! Redirigiendo al inicio de sesión...');
        setError('');

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(datos.mensaje || 'Hubo un error al registrarse. Intenta otra vez.');
      }
    } catch (err) {
      console.error('Error conectando al backend:', err);
      setError('No se pudo conectar al servidor. Verifica que el backend esté encendido.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Crear Cuenta en GAP</h2>
        <p>Insumos ganaderos de calidad</p>

        {error && <div className="error-mensaje">{error}</div>}
        {mensajeExito && <div className="exito-mensaje">{mensajeExito}</div>}

        <form onSubmit={manejarRegistro} className="login-form">
          <div className="form-group">
            <label>Nombre completo</label>
            <input
              type="text"
              placeholder="Ej: Juan Pérez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

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
              placeholder="Escribe tu contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input
              type="password"
              placeholder="Vuelve a escribir la contraseña"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">Regístrate</button>
        </form>

        <p className="login-footer">
          ¿Ya tienes una cuenta? <span onClick={() => navigate('/login')} className="link-text">Inicia sesión aquí</span>
        </p>
      </div>
    </div>
  );
}

export default Registro;
