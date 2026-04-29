-- ============================================
-- BASE DE DATOS: GAP (Insumos Ganaderos)
-- ============================================

-- 1. Crear la base de datos
CREATE DATABASE IF NOT EXISTS gap_db;

-- 2. Usar la base de datos
USE gap_db;

-- 3. Crear la tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id            INT AUTO_INCREMENT PRIMARY KEY,  -- ID único por usuario
  nombre        VARCHAR(100) NOT NULL,            -- Nombre completo
  email         VARCHAR(150) NOT NULL UNIQUE,     -- Email (no se puede repetir)
  contrasena    VARCHAR(255) NOT NULL,            -- Contraseña encriptada
  fecha_registro DATETIME DEFAULT NOW()           -- Fecha de creación automática
);


-- 5. Crear la tabla de productos con columna de características
CREATE TABLE IF NOT EXISTS productos (
  id              INT AUTO_INCREMENT PRIMARY KEY,          -- ID único por producto
  nombre          VARCHAR(150) NOT NULL,                   -- Nombre del producto
  descripcion     TEXT NOT NULL,                           -- Descripción detallada del producto
  precio          DECIMAL(12, 2) NOT NULL,                 -- Precio en pesos colombianos
  imagen_url      VARCHAR(500) NOT NULL,                   -- URL de la imagen del producto
  caracteristicas TEXT DEFAULT NULL,                       -- Características únicas del producto (formato JSON)
  stock           INT UNSIGNED NOT NULL DEFAULT 0,         -- Cantidad en inventario
  disponible      BOOLEAN NOT NULL DEFAULT TRUE,           -- Visibilidad del producto (compatible con el backend actual)
  fecha_creacion  DATETIME DEFAULT NOW()                   -- Fecha de creación automática
);

-- 6. Insertar los productos disponibles con info única para cada uno
INSERT INTO productos (nombre, descripcion, precio, imagen_url, caracteristicas, stock, disponible) VALUES
(
  'Llano Sal Somex Ceba',
  'Sal mineral para la etapa de levante que aporta un buen paquete de minerales entre ellos azufre y magnesio que coadyuvan a una mejor degradación de las pasturas y a mejorar la ganancia de peso, en especial en suelo de tipo ácido como son en el Meta, Guaviare y Casanare. Presentación de 40 kg.',
  137600.00,
  'https://veterinarialared.com/wp-content/uploads/2025/06/llano_sal_somex_ceba_bulto.jpg',
  '[
    {"icono": "Peso", "texto": "Presentación de 40 kg"},
    {"icono": "Animal", "texto": "Para ganado bovino en etapa de levante y ceba"},
    {"icono": "Registro", "texto": "Registro ICA N° 9064 SL"},
    {"icono": "Marca", "texto": "Marca Somex®"},
    {"icono": "Mineral", "texto": "Rico en azufre y magnesio"},
    {"icono": "Region", "texto": "Ideal para suelos ácidos del Meta, Guaviare y Casanare"}
  ]',
  100,
  TRUE
),
(
  'SAL SOMEX AL 7%',
  'Sal mineral alta en fósforo y microminerales que coadyuva a mejorar la actividad ovárica y la salud de las hembras y en el levante. Ayuda a sobrellevar situaciones de estrés como las que se tiene en sistemas de producción de leche y el consecuente desgaste de los animales.',
  152850.00,
  'https://veterinarialared.com/wp-content/uploads/2025/06/caqueta_sal_somex_7_bulto.jpg',
  '[
    {"icono": "Peso", "texto": "Presentación de 40 kg"},
    {"icono": "Animal", "texto": "Para ganado hembras"},
    {"icono": "Registro", "texto": "Registro ICA N° 9064 SL"},
    {"icono": "Marca", "texto": "Marca Somex®"},
    {"icono": "Mineral", "texto": "alta en fósforo y microminerales"},
    {"icono": "Region", "texto": "Ideal para suelos ácidos del Meta, Guaviare y Casanare"}
   ]',
  100,
  TRUE
),
(
  'CALCILECHE AL 15%',
  'Sal mineralizada para vacas en producción en lecheria especializada, con niveles medios de fertilización.',
  134200.00,
  'https://doyare.com/wp-content/uploads/2021/01/CALCILECHE-AL-15%EF%BF%BD-%EF%BF%BD85.900-300x300.png',
  '[
    {"icono": "Peso", "texto": "Presentación de 40 kg"},
    {"icono": "Animal", "texto": "Vacas en producción en lechería especializada, con niveles medios de fertilización."},
    {"icono": "Registro", "texto": "Registro ICA N° 9064 SL"},
    {"icono": "Marca", "texto": "Marca Somex®"},
    {"icono": "Mineral", "texto": "alta en fósforo y microminerales"},
    {"icono": "Region", "texto": "Ideal para suelos ácidos del Meta, Guaviare y Casanare"}
   ]',
  100,
  TRUE
),
(
  'Bovimín',
  'Sal mineral con un contenido medio-bajo de fósforo que ayuda a mejorar la presentación del ganado. Disminuye la incidencia de moscas y complementa el aporte de las pasturas con un alto contenido de azufre. Presentación de 40 kg.',
  100400.00,
  'https://doyare.com/wp-content/uploads/2021/01/BOVIMIN-X-40-KG-%EF%BF%BD-57.800.png',
  '[
    {"icono": "Peso", "texto": "Presentación de 40 kg"},
    {"icono": "Animal", "texto": "Para ganado bovino en general"},
    {"icono": "Registro", "texto": "Registro ICA N° 12061 SL"},
    {"icono": "Marca", "texto": "Marca Somex®"},
    {"icono": "Mineral", "texto": "Contenido medio-bajo de fósforo, alto en azufre"},
    {"icono": "Beneficio", "texto": "Disminuye la incidencia de moscas"}
  ]',
  100,
  TRUE
);

-- 7. Verificar que las tablas se crearon correctamente
SELECT 'Tabla usuarios creada correctamente' AS mensaje;
SELECT 'Tabla productos creada correctamente' AS mensaje;
SELECT * FROM productos;
