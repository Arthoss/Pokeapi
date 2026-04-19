// router.js - Manejo de rutas sin frameworks
const { getAllPokemons, getPokemonByName, getPokemonById } = require('./db');

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
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  if (req.method !== 'GET') {
    return sendJSON(res, 405, { error: 'Method not allowed' });
  }

  try {
    // GET /api/pokemons - Listar todos
    if (path === '/api/pokemons') {
      const pokemons = await getAllPokemons();
      return sendJSON(res, 200, { data: pokemons, total: pokemons.length });
    }

    // GET /api/pokemons/:id - Por ID numérico
    const byIdMatch = path.match(/^\/api\/pokemons\/(\d+)$/);
    if (byIdMatch) {
      const pokemon = await getPokemonById(byIdMatch[1]);
      if (!pokemon) return sendJSON(res, 404, { error: 'Pokemon no encontrado' });
      return sendJSON(res, 200, { data: pokemon });
    }

    // GET /api/pokemon/:name - Por nombre
    const byNameMatch = path.match(/^\/api\/pokemon\/([a-zA-Z]+)$/);
    if (byNameMatch) {
      const pokemon = await getPokemonByName(byNameMatch[1]);
      if (!pokemon) return sendJSON(res, 404, { error: 'Pokemon no encontrado' });
      return sendJSON(res, 200, { data: pokemon });
    }

    // GET /swagger.json - Documentación
    if (path === '/swagger.json') {
      const swagger = require('./swagger');
      return sendJSON(res, 200, swagger);
    }

    // GET /docs - Swagger UI
    if (path === '/docs' || path === '/docs/') {
      const swaggerUI = require('./swaggerUI');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      return res.end(swaggerUI);
    }

    // GET / - Health check
    if (path === '/') {
      return sendJSON(res, 200, {
        status: 'ok',
        message: 'Pokemon API funcionando 🎮',
        docs: '/docs',
        endpoints: [
          'GET /api/pokemons',
          'GET /api/pokemons/:id',
          'GET /api/pokemon/:name'
        ]
      });
    }

    return sendJSON(res, 404, { error: 'Ruta no encontrada' });

  } catch (err) {
    console.error('Error:', err.message);
    return sendJSON(res, 500, { error: 'Error interno del servidor' });
  }
}

module.exports = { handleRequest };
