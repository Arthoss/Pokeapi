// ── ANIMES USUARIOS ───────────────────────────────────────────────────────────

async function createAnimeUsuario(userId, { nombre, descripcion, genero, imagen_url }) {
  const { rows } = await pool.query(
    `INSERT INTO animes_usuarios (usuario_id, nombre, descripcion, genero, imagen_url)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, nombre, descripcion || null, genero || null, imagen_url || null]
  );
  return rows[0];
}

async function getAnimesByUsuario(userId) {
  const { rows } = await pool.query(
    `SELECT a.*, COUNT(p.id) as total_personajes
     FROM animes_usuarios a
     LEFT JOIN personajes_usuarios p ON p.anime_id = a.id
     WHERE a.usuario_id = $1
     GROUP BY a.id
     ORDER BY a.created_at DESC`,
    [userId]
  );
  return rows;
}

async function getAnimeUsuarioById(userId, animeId) {
  const { rows } = await pool.query(
    `SELECT * FROM animes_usuarios WHERE id = $1 AND usuario_id = $2`,
    [animeId, userId]
  );
  return rows[0] || null;
}

async function deleteAnimeUsuario(userId, animeId) {
  await pool.query(
    `DELETE FROM animes_usuarios WHERE id = $1 AND usuario_id = $2`,
    [animeId, userId]
  );
}

// ── PERSONAJES USUARIOS ───────────────────────────────────────────────────────

async function createPersonajeUsuario(userId, animeId, { nombre, edad, poder_tecnica, origen, descripcion }) {
  const { rows } = await pool.query(
    `INSERT INTO personajes_usuarios (usuario_id, anime_id, nombre, edad, poder_tecnica, origen, descripcion)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [userId, animeId, nombre, edad || null, poder_tecnica || null, origen || null, descripcion || null]
  );
  return rows[0];
}

async function getPersonajesByAnimeUsuario(userId, animeId) {
  const { rows } = await pool.query(
    `SELECT p.*, COUNT(i.id) as total_imagenes
     FROM personajes_usuarios p
     LEFT JOIN imagenes_usuarios i ON i.personaje_id = p.id
     WHERE p.anime_id = $1 AND p.usuario_id = $2
     GROUP BY p.id
     ORDER BY p.created_at DESC`,
    [animeId, userId]
  );
  return rows;
}

async function getPersonajeUsuarioById(userId, personajeId) {
  const { rows } = await pool.query(
    `SELECT p.*, COUNT(i.id) as total_imagenes
     FROM personajes_usuarios p
     LEFT JOIN imagenes_usuarios i ON i.personaje_id = p.id
     WHERE p.id = $1 AND p.usuario_id = $2
     GROUP BY p.id`,
    [personajeId, userId]
  );
  return rows[0] || null;
}

async function deletePersonajeUsuario(userId, personajeId) {
  await pool.query(
    `DELETE FROM personajes_usuarios WHERE id = $1 AND usuario_id = $2`,
    [personajeId, userId]
  );
}

// ── IMÁGENES USUARIOS ─────────────────────────────────────────────────────────

async function addImagenPersonajeUsuario(userId, personajeId, { url, pose }) {
  const { rows } = await pool.query(
    `INSERT INTO imagenes_usuarios (usuario_id, personaje_id, url, pose)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, personajeId, url, pose || 'pose1']
  );
  return rows[0];
}

async function getImagenesByPersonajeUsuario(personajeId) {
  const { rows } = await pool.query(
    `SELECT * FROM imagenes_usuarios WHERE personaje_id = $1 ORDER BY created_at`,
    [personajeId]
  );
  return rows;
}

async function deleteImagenUsuario(userId, imagenId) {
  await pool.query(
    `DELETE FROM imagenes_usuarios WHERE id = $1 AND usuario_id = $2`,
    [imagenId, userId]
  );
}

module.exports = {
  getAnimes, getAllPersonajes, getPersonajeByNombre, getPersonajesByAnime, getImagenesByNombre,
  registerUser, loginUser, getUserById,
  getCategoriasByUser, createCategoria, deleteCategoria,
  getAnimesByCategoria, createAnimeEnCategoria, getAnimeById, deleteAnimeEnCategoria,
  createAnimeUsuario, getAnimesByUsuario, getAnimeUsuarioById, deleteAnimeUsuario,
  createPersonajeUsuario, getPersonajesByAnimeUsuario, getPersonajeUsuarioById, deletePersonajeUsuario,
  addImagenPersonajeUsuario, getImagenesByPersonajeUsuario, deleteImagenUsuario,
};