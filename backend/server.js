const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

app.post('/api/registro', async (req, res) => {
  try {
    const { nombre, email, contrasena } = req.body;

    if (!nombre || !email || !contrasena) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    const [usuariosDB] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (usuariosDB.length > 0) {
      return res.status(400).json({ mensaje: 'El correo electrónico ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const contrasenaEncriptada = await bcrypt.hash(contrasena, salt);

    const [resultado] = await pool.query(
      'INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)',
      [nombre, email, contrasenaEncriptada]
    );

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuarioId: resultado.insertId
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ mensaje: 'Error al registrar el usuario' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
      return res.status(400).json({ mensaje: 'Por favor, ingresa email y contraseña' });
    }

    const [usuariosDB] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (usuariosDB.length === 0) {
      return res.status(401).json({ mensaje: 'Correo electrónico no encontrado' });
    }

    const usuario = usuariosDB[0];

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!contrasenaValida) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token: 'fake-jwt-token-por-ahora',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
});

// ========================================
// ENDPOINT: Obtener productos disponibles
// ========================================
app.get('/api/productos', async (req, res) => {
  try {
    const [productos] = await pool.query(
      'SELECT id, nombre, descripcion, precio, imagen_url FROM productos WHERE disponible = TRUE ORDER BY fecha_creacion DESC'
    );

    res.json(productos);
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({ mensaje: 'Error al obtener los productos' });
  }
});

// ============================================
// ENDPOINT: Obtener un producto por su ID
// ============================================
app.get('/api/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [productos] = await pool.query(
      'SELECT id, nombre, descripcion, precio, imagen_url, caracteristicas, disponible FROM productos WHERE id = ?',
      [id]
    );

    if (productos.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json(productos[0]);
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({ mensaje: 'Error al obtener el producto' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
  console.log(`Puedes probarlo en: http://localhost:${PORT}`);
});
