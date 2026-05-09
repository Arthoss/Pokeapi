// db.js - Conexión a Supabase via PostgreSQL (pg)
const { Pool } = require('pg');

// Lee las credenciales del archivo .env
require('dotenv').config();

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASS,
  ssl: { rejectUnauthorized: false }
});

// Verificar conexión al iniciar
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error conectando a Supabase:', err.message);
  } else {
    console.log('✅ Conectado a Supabase PostgreSQL');
    release();
  }
});

// ── GET todos los animes únicos ─────────────────────────────────────────────
async function getAnimes() {
  const { rows } = await pool.query(
    `SELECT DISTINCT anime, COUNT(*) as total_personajes
     FROM personajes
     GROUP BY anime
     ORDER BY anime`
  );
  return rows;
}

// ── GET todos los personajes ────────────────────────────────────────────────
async function getAllPersonajes() {
  const { rows } = await pool.query(
    `SELECT p.id, p.nombre, p.anime, p.edad, p.poder_tecnica, p.origen, p.descripcion,
            COUNT(i.id) as total_imagenes
     FROM personajes p
     LEFT JOIN imagenes i ON LOWER(i.personaje) = LOWER(p.nombre)
     GROUP BY p.id
     ORDER BY p.anime, p.nombre`
  );
  return rows;
}

// ── GET personaje por nombre exacto (case-insensitive) ─────────────────────
async function getPersonajeByNombre(nombre) {
  const { rows } = await pool.query(
    `SELECT p.id, p.nombre, p.anime, p.edad, p.poder_tecnica, p.origen, p.descripcion,
            COUNT(i.id) as total_imagenes
     FROM personajes p
     LEFT JOIN imagenes i ON LOWER(i.personaje) = LOWER(p.nombre)
     WHERE LOWER(p.nombre) = LOWER($1)
     GROUP BY p.id`,
    [nombre]
  );
  return rows[0] || null;
}

// ── GET personajes por anime ────────────────────────────────────────────────
async function getPersonajesByAnime(anime) {
  const { rows } = await pool.query(
    `SELECT p.id, p.nombre, p.anime, p.edad, p.poder_tecnica, p.origen, p.descripcion,
            COUNT(i.id) as total_imagenes
     FROM personajes p
     LEFT JOIN imagenes i ON LOWER(i.personaje) = LOWER(p.nombre)
     WHERE LOWER(p.anime) = LOWER($1)
     GROUP BY p.id
     ORDER BY p.nombre`,
    [anime]
  );
  return rows;
}

// ── GET imágenes de un personaje ────────────────────────────────────────────
// La tabla imagenes usa columna 'personaje' (VARCHAR) como FK por nombre
// y columna 'pose' (ej: 'pose1', 'pose2'...)
async function getImagenesByNombre(nombre) {
  const { rows } = await pool.query(
    `SELECT i.id, i.url, i.descripcion, i.pose,
            i.personaje as nombre, i.anime
     FROM imagenes i
     WHERE LOWER(i.personaje) = LOWER($1)
     ORDER BY i.pose`,
    [nombre]
  );
  return rows;
}

module.exports = {
  getAnimes,
  getAllPersonajes,
  getPersonajeByNombre,
  getPersonajesByAnime,
  getImagenesByNombre
};