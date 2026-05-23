const {
  getAnimes, getAllPersonajes, getPersonajeByNombre, getPersonajesByAnime, getImagenesByNombre,
  registerUser, loginUser, getUserById,
  getCategoriasByUser, createCategoria, deleteCategoria,
  getAnimesByCategoria, createAnimeEnCategoria, getAnimeById, deleteAnimeEnCategoria,
  createAnimeUsuario, getAnimesByUsuario, getAnimeUsuarioById, deleteAnimeUsuario,
  createPersonajeUsuario, getPersonajesByAnimeUsuario, getPersonajeUsuarioById, deletePersonajeUsuario,
  addImagenPersonajeUsuario, getImagenesByPersonajeUsuario, deleteImagenUsuario,
} = require('./db');

const { verifyToken } = require('./auth');

function sendJSON(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); }
      catch { reject(new Error('Body JSON inválido')); }
    });
  });
}

async function handleRequest(req, res) {
  const url    = new URL(req.url, `http://${req.headers.host}`);
  const path   = url.pathname;
  const method = req.method;

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }

  try {

    // ── Health check ──────────────────────────────────────────────────────────
    if (path === '/' && method === 'GET') {
      return sendJSON(res, 200, { status: 'ok', message: '🎌 Anime API v2.0 funcionando' });
    }

    // ── AUTH ──────────────────────────────────────────────────────────────────

    if (path === '/api/auth/register' && method === 'POST') {
      const { username, email, password } = await parseBody(req);
      if (!username || !email || !password)
        return sendJSON(res, 400, { error: 'username, email y password son requeridos' });
      const user = await registerUser(username, email, password);
      return sendJSON(res, 201, { message: 'Usuario creado', user });
    }

    if (path === '/api/auth/login' && method === 'POST') {
      const { email, password } = await parseBody(req);
      if (!email || !password)
        return sendJSON(res, 400, { error: 'email y password son requeridos' });
      const result = await loginUser(email, password);
      if (!result) return sendJSON(res, 401, { error: 'Credenciales inválidas' });
      return sendJSON(res, 200, result);
    }

    if (path === '/api/auth/me' && method === 'GET') {
      const payload = verifyToken(req);
      if (!payload) return sendJSON(res, 401, { error: 'Token inválido o expirado' });
      const user = await getUserById(payload.id);
      if (!user) return sendJSON(res, 404, { error: 'Usuario no encontrado' });
      return sendJSON(res, 200, { user });
    }

    // ── CATEGORÍAS ────────────────────────────────────────────────────────────

    if (path === '/api/categorias' && method === 'GET') {
      const payload = verifyToken(req);
      if (!payload) return sendJSON(res, 401, { error: 'No autorizado' });
      const data = await getCategoriasByUser(payload.id);
      return sendJSON(res, 200, { data, total: data.length });
    }

    if (path === '/api/categorias' && method === 'POST') {
      const payload = verifyToken(req);
      if (!payload) return sendJSON(res, 401, { error: 'No autorizado' });
      const { nombre, descripcion, color } = await parseBody(req);
      if (!nombre) return sendJSON(res, 400, { error: 'nombre es requerido' });
      const cat = await createCategoria(payload.id, nombre, descripcion, color);
      return sendJSON(res, 201, { message: 'Categoría creada', data: cat });
    }

    const delCatMatch = path.match(/^\/api\/categorias\/(\d+)$/);
    if (delCatMatch && method === 'DELETE') {
      const payload = verifyToken(req);
      if (!payload) return sendJSON(res, 401, { error: 'No autorizado' });
      await deleteCategoria(payload.id, parseInt(delCatMatch[1]));
      return sendJSON(res, 200, { message: 'Categoría eliminada' });
    }

    const getAnimesMatch = path.match(/^\/api\/categorias\/(\d+)\/animes$/);
    if (getAnimesMatch && method === 'GET') {
      const payload = verifyToken(req);
      if (!payload) return sendJSON(res, 401, { error: 'No autorizado' });
      const data = await getAnimesByCategoria(payload.id, parseInt(getAnimesMatch[1]));
      return sendJSON(res, 200, { data, total: data.length });
    }

    const postAnimesMatch = path.match(/^\/api\/categorias\/(\d+)\/animes$/);
    if (postAnimesMatch && method === 'POST') {
      const payload = verifyToken(req);
      if (!payload) return sendJSON(res, 401, { error: 'No autorizado' });
      const body = await parseBody(req);
      if (!body.titulo) return sendJSON(res, 400, { error: 'titulo es requerido' });
      const anime = await createAnimeEnCategoria(payload.id, parseInt(postAnimesMatch[1]), body);
      return sendJSON(res, 201, { message: 'Anime agregado', data: anime });
    }

    const delAnimeMatch = path.match(/^\/api\/mis-animes\/(\d+)$/);
    if (delAnimeMatch && method === 'DELETE') {
      const payload = verifyToken(req);
      if (!payload) return sendJSON(res, 401, { error: 'No autorizado' });
      await deleteAnimeEnCategoria(payload.id, parseInt(delAnimeMatch[1]));
      return sendJSON(res, 200, { message: 'Anime eliminado' });
    }

    // ── PERSONAJES (públicos) ─────────────────────────────────────────────────

    if (path === '/api/animes' && method === 'GET') {
      const data = await getAnimes();
      return sendJSON(res, 200, { data, total: data.length });
    }

    if (path === '/api/personajes' && method === 'GET') {
      const data = await getAllPersonajes();
      return sendJSON(res, 200, { data, total: data.length });
    }

    const byAnimeMatch = path.match(/^\/api\/personajes\/anime\/(.+)$/);
    if (byAnimeMatch && method === 'GET') {
      const anime = decodeURIComponent(byAnimeMatch[1]);
      const data  = await getPersonajesByAnime(anime);
      if (!data.length) return sendJSON(res, 404, { error: `No se encontraron personajes del anime "${anime}"` });
      return sendJSON(res, 200, { anime, data, total: data.length });
    }

    const imagenesMatch = path.match(/^\/api\/personajes\/(.+)\/imagenes$/);
    if (imagenesMatch && method === 'GET') {
      const nombre = decodeURIComponent(imagenesMatch[1]);
      const data   = await getImagenesByNombre(nombre);
      if (!data.length) return sendJSON(res, 404, { error: `No se encontraron imágenes para "${nombre}"` });
      return sendJSON(res, 200, { personaje: nombre, data, total: data.length });
    }

    const byNombreMatch = path.match(/^\/api\/personajes\/([^/]+)$/);
    if (byNombreMatch && method === 'GET') {
      const nombre = decodeURIComponent(byNombreMatch[1]);
      const data   = await getPersonajeByNombre(nombre);
      if (!data) return sendJSON(res, 404, { error: `Personaje "${nombre}" no encontrado` });
      return sendJSON(res, 200, { data });
    }

    if (path === '/swagger.json') return sendJSON(res, 200, require('./swagger'));
    if (path === '/docs' || path === '/docs/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      return res.end(require('./swaggerUI'));
    }

    // ── ANIMES USUARIOS ────────────────────────────────────────────────────────

    if (path === '/api/mis-animes-custom' && method === 'GET') {
      const payload = verifyToken(req);
      if (!payload) return sendJSON(res, 401, { error: 'No autorizado' });
      const data = await getAnimesByUsuario(payload.id);
      return sendJSON(res, 200, { data, total: data.length });
    }

    if (path === '/api/mis-animes-custom' && method === 'POST') {
      const payload = verifyToken(req);
      if (!payload) return sendJSON(res, 401, { error: 'No autorizado' });
      const body = await parseBody(req);
      if (!body.nombre) return sendJSON(res, 400, { error: 'nombre es requerido' });
      const anime = await createAnimeUsuario(payload.id, body);
      return sendJSON(res, 201, { message: 'Anime creado', data: anime });
    }

    const delAnimeCustomMatch = path.match(/^\/api\/mis-animes-custom\/(\d+)$/);
    if (delAnimeCustomMatch && method === 'DELETE') {
      const payload = verifyToken(req);
      if (!payload) return sendJSON(res, 401, { error: 'No autorizado' });
      await deleteAnimeUsuario(payload.id, parseInt(delAnimeCustomMatch[1]));
      return sendJSON(res, 200, { message: 'Anime eliminado' });
    }

    // ── PERSONAJES USUARIOS ────────────────────────────────────────────────────

    const getPersonajesCustomMatch = path.match(/^\/api\/mis-animes-custom\/(\d+)\/personajes$/);
    if (getPersonajesCustomMatch && method === 'GET') {
      const payload = verifyToken(req);
      if (!payload) return sendJSON(res, 401, { error: 'No autorizado' });
      const data = await getPersonajesByAnimeUsuario(payload.id, parseInt(getPersonajesCustomMatch[1]));
      return sendJSON(res, 200, { data, total: data.length });
    }

    const postPersonajesCustomMatch = path.match(/^\/api\/mis-animes-custom\/(\d+)\/personajes$/);
    if (postPersonajesCustomMatch && method === 'POST') {
      const payload = verifyToken(req);
      if (!payload) return sendJSON(res, 401, { error: 'No autorizado' });
      const body = await parseBody(req);
      if (!body.nombre) return sendJSON(res, 400, { error: 'nombre es requerido' });
      const personaje = await createPersonajeUsuario(payload.id, parseInt(postPersonajesCustomMatch[1]), body);
      return sendJSON(res, 201, { message: 'Personaje creado', data: personaje });
    }

    const delPersonajeCustomMatch = path.match(/^\/api\/mis-personajes\/(\d+)$/);
    if (delPersonajeCustomMatch && method === 'DELETE') {
      const payload = verifyToken(req);
      if (!payload) return sendJSON(res, 401, { error: 'No autorizado' });
      await deletePersonajeUsuario(payload.id, parseInt(delPersonajeCustomMatch[1]));
      return sendJSON(res, 200, { message: 'Personaje eliminado' });
    }

    const getPersonajeCustomMatch = path.match(/^\/api\/mis-personajes\/(\d+)$/);
    if (getPersonajeCustomMatch && method === 'GET') {
      const payload = verifyToken(req);
      if (!payload) return sendJSON(res, 401, { error: 'No autorizado' });
      const data = await getPersonajeUsuarioById(payload.id, parseInt(getPersonajeCustomMatch[1]));
      if (!data) return sendJSON(res, 404, { error: 'Personaje no encontrado' });
      return sendJSON(res, 200, { data });
    }

    // ── IMÁGENES USUARIOS ──────────────────────────────────────────────────────

    const getImagenesCustomMatch = path.match(/^\/api\/mis-personajes\/(\d+)\/imagenes$/);
    if (getImagenesCustomMatch && method === 'GET') {
      const payload = verifyToken(req);
      if (!payload) return sendJSON(res, 401, { error: 'No autorizado' });
      const data = await getImagenesByPersonajeUsuario(parseInt(getImagenesCustomMatch[1]));
      return sendJSON(res, 200, { data, total: data.length });
    }

    const postImagenesCustomMatch = path.match(/^\/api\/mis-personajes\/(\d+)\/imagenes$/);
    if (postImagenesCustomMatch && method === 'POST') {
      const payload = verifyToken(req);
      if (!payload) return sendJSON(res, 401, { error: 'No autorizado' });
      const body = await parseBody(req);
      if (!body.url) return sendJSON(res, 400, { error: 'url es requerida' });
      const imagen = await addImagenPersonajeUsuario(payload.id, parseInt(postImagenesCustomMatch[1]), body);
      return sendJSON(res, 201, { message: 'Imagen agregada', data: imagen });
    }

    const delImagenCustomMatch = path.match(/^\/api\/mis-imagenes\/(\d+)$/);
    if (delImagenCustomMatch && method === 'DELETE') {
      const payload = verifyToken(req);
      if (!payload) return sendJSON(res, 401, { error: 'No autorizado' });
      await deleteImagenUsuario(payload.id, parseInt(delImagenCustomMatch[1]));
      return sendJSON(res, 200, { message: 'Imagen eliminada' });
    }

    return sendJSON(res, 404, { error: 'Ruta no encontrada' });

  } catch (err) {
    console.error('Error en la API:', err.message);
    return sendJSON(res, 500, { error: 'Error interno del servidor', detalle: err.message });
  }
}

module.exports = { handleRequest };