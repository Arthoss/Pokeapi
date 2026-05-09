// router.js - Rutas de la Anime API (Node.js puro, sin frameworks)
const {
  getAnimes,
  getAllPersonajes,
  getPersonajeByNombre,
  getPersonajesByAnime,
  getImagenesByNombre
} = require('./db');
 
function sendJSON(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}
 
async function handleRequest(req, res) {
  const url   = new URL(req.url, `http://${req.headers.host}`);
  const path  = url.pathname;
 
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }
 
  if (req.method !== 'GET') {
    return sendJSON(res, 405, { error: 'Método no permitido. Solo GET.' });
  }
 
  try {
 
    // ── GET / ─ Health check ────────────────────────────────────────────────
    if (path === '/') {
      return sendJSON(res, 200, {
        status: 'ok',
        message: '🎌 Anime API funcionando',
        docs: '/docs',
        endpoints: [
          'GET /api/animes',
          'GET /api/personajes',
          'GET /api/personajes/:nombre',
          'GET /api/personajes/anime/:anime',
          'GET /api/personajes/:nombre/imagenes'
        ]
      });
    }
 
    // ── GET /api/animes ─ Lista de animes únicos ────────────────────────────
    if (path === '/api/animes') {
      const data = await getAnimes();
      return sendJSON(res, 200, { data, total: data.length });
    }
 
    // ── GET /api/personajes ─ Todos los personajes ──────────────────────────
    if (path === '/api/personajes') {
      const data = await getAllPersonajes();
      return sendJSON(res, 200, { data, total: data.length });
    }
 
    // ── GET /api/personajes/anime/:anime ─ Personajes por anime ────────────
    // IMPORTANTE: este match va ANTES de /:nombre para evitar conflicto
    const byAnimeMatch = path.match(/^\/api\/personajes\/anime\/(.+)$/);
    if (byAnimeMatch) {
      const anime = decodeURIComponent(byAnimeMatch[1]);
      const data  = await getPersonajesByAnime(anime);
      if (!data.length) {
        return sendJSON(res, 404, {
          error: `No se encontraron personajes del anime "${anime}"`,
          sugerencia: 'Valores válidos: saint_seiya, hunter_x_hunter, one_piece'
        });
      }
      return sendJSON(res, 200, { anime, data, total: data.length });
    }
 
    // ── GET /api/personajes/:nombre/imagenes ─ Imágenes de un personaje ────
    const imagenesMatch = path.match(/^\/api\/personajes\/(.+)\/imagenes$/);
    if (imagenesMatch) {
      const nombre = decodeURIComponent(imagenesMatch[1]);
      const data   = await getImagenesByNombre(nombre);
      if (!data.length) {
        return sendJSON(res, 404, {
          error: `No se encontraron imágenes para "${nombre}"`,
          sugerencia: 'Verifica que el personaje existe y tiene imágenes registradas'
        });
      }
      return sendJSON(res, 200, {
        personaje: nombre,
        data,
        total: data.length
      });
    }
 
    // ── GET /api/personajes/:nombre ─ Personaje por nombre ─────────────────
    const byNombreMatch = path.match(/^\/api\/personajes\/([^/]+)$/);
    if (byNombreMatch) {
      const nombre = decodeURIComponent(byNombreMatch[1]);
      const data   = await getPersonajeByNombre(nombre);
      if (!data) {
        return sendJSON(res, 404, {
          error: `Personaje "${nombre}" no encontrado`,
          sugerencia: 'Verifica la ortografía del nombre'
        });
      }
      return sendJSON(res, 200, { data });
    }
 
    // ── GET /swagger.json ───────────────────────────────────────────────────
    if (path === '/swagger.json') {
      const swagger = require('./swagger');
      return sendJSON(res, 200, swagger);
    }
 
    // ── GET /docs ─ Swagger UI ──────────────────────────────────────────────
    if (path === '/docs' || path === '/docs/') {
      const swaggerUI = require('./swaggerUI');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      return res.end(swaggerUI);
    }
 
    return sendJSON(res, 404, { error: 'Ruta no encontrada' });
 
  } catch (err) {
    console.error('Error en la API:', err.message);
    return sendJSON(res, 500, {
      error: 'Error interno del servidor',
      detalle: err.message
    });
  }
}
 
module.exports = { handleRequest };