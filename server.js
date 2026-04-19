// server.js - Servidor HTTP puro Node.js (sin frameworks)
const http = require('http');
const { handleRequest } = require('./src/router');

const PORT = process.env.PORT || 3000;

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`\n🚀 Pokemon API corriendo en http://localhost:${PORT}`);
  console.log(`📚 Documentación: http://localhost:${PORT}/docs`);
  console.log(`🔗 Endpoints:`);
  console.log(`   GET http://localhost:${PORT}/api/pokemons`);
  console.log(`   GET http://localhost:${PORT}/api/pokemons/:id`);
  console.log(`   GET http://localhost:${PORT}/api/pokemon/:name\n`);
});
