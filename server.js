const http = require('http');
const { handleRequest } = require('./src/router');

const PORT = process.env.PORT || 3000;

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`\n🎌 Anime API v2.0 corriendo en http://localhost:${PORT}`);
  console.log(`📚 Documentación Swagger: http://localhost:${PORT}/docs`);
});