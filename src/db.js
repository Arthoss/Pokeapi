const { Pool } = require('pg');
const { createToken, hashPassword } = require('./auth');

require('dotenv').config();

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASS,
  ssl: { rejectUnauthorized: false },
});

pool.connect((err, client, release) => {
  if (err) console.error('❌ Error conectando a Supabase:', err.message);
  else { console.log('✅ Conectado a Supabase PostgreSQL'); release(); }
});

// ── AUTH ──────────────────────────────────────────────────────────────────────

async function registerUser(username, email, password) {
  const hashed = hashPassword(password);
  const { rows } = await pool.query(
    `INSERT INTO usuarios (username, email, password) VALUES ($1, $2, $3)
     RETURNING id, username, email, created_at`,
    [username, email, hashed]
  );
  return rows[0];
}

async function loginUser(email, password) {
  const hashed = hashPassword(password);
  const { rows } = await pool.query(
    `SELECT id, username, email FROM usuarios WHERE email = $1 AND password = $2`,
    [email, hashed]
  );
  if (!rows[0]) return null;
  const token = createToken({ id: rows[0].id, email: rows[0].email });
  return { token, user: rows[0] };
}

async function getUserById(id) {
  const { rows } = await pool.query(
    `SELECT id, username, email, created_at FROM usuarios WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

// ── CATEGORÍAS ────────────────────────────────────────────────────────────────

async function getCategoriasByUser(userId) {
  const { rows } = await pool.query(
    `SELECT c.*, COUNT(a.id) as total_animes
     FROM categorias c
     LEFT JOIN mis_animes a ON a.categoria_id = c.id
     WHERE c.usuario_id = $1
     GROUP BY c.id
     ORDER BY c.created_at DESC`,
    [userId]
  );
  return rows;
}

async function createCategoria(userId, nombre, descripcion, color) {
  const { rows } = await pool.query(
    `INSERT INTO categorias (usuario_id, nombre, descripcion, color)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, nombre, descripcion || null, color || '#FFD700']
  );
  return rows[0];
}

async function deleteCategoria(userId, catId) {
  await pool.query(
    `DELETE FROM categorias WHERE id = $1 AND usuario_id = $2`,
    [catId, userId]
  );
}

// ── ANIMES PERSONALIZADOS ─────────────────────────────────────────────────────

async function getAnimesByCategoria(userId, catId) {
  const { rows } = await pool.query(
    `SELECT a.* FROM mis_animes a
     JOIN categorias c ON c.id = a.categoria_id
     WHERE a.categoria_id = $1 AND c.usuario_id = $2
     ORDER BY a.created_at DESC`,
    [catId, userId]
  );
  return rows;
}

async function createAnimeEnCategoria(userId, catId, data) {
  const { titulo, genero, estado, calificacion, notas, imagen_url } = data;
  const { rows } = await pool.query(
    `INSERT INTO mis_animes (usuario_id, categoria_id, titulo, genero, estado, calificacion, notas, imagen_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [userId, catId, titulo, genero || null, estado || 'pendiente',
     calificacion || null, notas || null, imagen_url || null]
  );
  return rows[0];
}

async function getAnimeById(userId, animeId) {
  const { rows } = await pool.query(
    `SELECT a.* FROM mis_animes a WHERE a.id = $1 AND a.usuario_id = $2`,
    [animeId, userId]
  );
  return rows[0] || null;
}

async function deleteAnimeEnCategoria(userId, animeId) {
  await pool.query(
    `DELETE FROM mis_animes WHERE id = $1 AND usuario_id = $2`,
    [animeId, userId]
  );
}

// ── PERSONAJES (existentes) ───────────────────────────────────────────────────

async function getAnimes() {
  const { rows } = await pool.query(
    `SELECT DISTINCT anime, COUNT(*) as total_personajes FROM personajes GROUP BY anime ORDER BY anime`
  );
  return rows;
}

async function getAllPersonajes() {
  const { rows } = await pool.query(
    `SELECT p.id, p.nombre, p.anime, p.edad, p.poder_tecnica, p.origen, p.descripcion,
            COUNT(i.id) as total_imagenes
     FROM personajes p
     LEFT JOIN imagenes i ON LOWER(i.personaje) = LOWER(p.nombre)
     GROUP BY p.id ORDER BY p.anime, p.nombre`
  );
  return rows;
}

async function getPersonajeByNombre(nombre) {
  const { rows } = await pool.query(
    `SELECT p.id, p.nombre, p.anime, p.edad, p.poder_tecnica, p.origen, p.descripcion,
            COUNT(i.id) as total_imagenes
     FROM personajes p
     LEFT JOIN imagenes i ON LOWER(i.personaje) = LOWER(p.nombre)
     WHERE LOWER(p.nombre) = LOWER($1) GROUP BY p.id`,
    [nombre]
  );
  return rows[0] || null;
}

async function getPersonajesByAnime(anime) {
  const { rows } = await pool.query(
    `SELECT p.id, p.nombre, p.anime, p.edad, p.poder_tecnica, p.origen, p.descripcion,
            COUNT(i.id) as total_imagenes
     FROM personajes p
     LEFT JOIN imagenes i ON LOWER(i.personaje) = LOWER(p.nombre)
     WHERE LOWER(p.anime) = LOWER($1) GROUP BY p.id ORDER BY p.nombre`,
    [anime]
  );
  return rows;
}

async function getImagenesByNombre(nombre) {
  const { rows } = await pool.query(
    `SELECT i.id, i.url, i.descripcion, i.pose, i.personaje as nombre, i.anime
     FROM imagenes i WHERE LOWER(i.personaje) = LOWER($1) ORDER BY i.pose`,
    [nombre]
  );
  return rows;
}

module.exports = {
  getAnimes, getAllPersonajes, getPersonajeByNombre, getPersonajesByAnime, getImagenesByNombre,
  registerUser, loginUser, getUserById,
  getCategoriasByUser, createCategoria, deleteCategoria,
  getAnimesByCategoria, createAnimeEnCategoria, getAnimeById, deleteAnimeEnCategoria,
};