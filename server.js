const http = require('http');
const { handleRequest } = require('./src/router');
 
const PORT = process.env.PORT || 3000;
 
const server = http.createServer(handleRequest);
 
server.listen(PORT, () => {
  console.log(`\n🎌 Anime API corriendo en http://localhost:${PORT}`);
  console.log(`📚 Documentación Swagger: http://localhost:${PORT}/docs`);
  console.log(`🔗 Endpoints disponibles:`);
  console.log(`   GET http://localhost:${PORT}/api/animes`);
  console.log(`   GET http://localhost:${PORT}/api/personajes`);
  console.log(`   GET http://localhost:${PORT}/api/personajes/:nombre`);
  console.log(`   GET http://localhost:${PORT}/api/personajes/anime/:anime`);
  console.log(`   GET http://localhost:${PORT}/api/personajes/:nombre/imagenes\n`);
});
 