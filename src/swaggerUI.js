module.exports = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pokemon API - Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #1a1a2e; font-family: sans-serif; }
    .header {
      background: linear-gradient(135deg, #e74c3c, #c0392b);
      padding: 20px 30px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .header img { width: 55px; height: 55px; }
    .header h1 { color: #fff; font-size: 24px; }
    .header p { color: rgba(255,255,255,0.85); font-size: 13px; margin-top: 4px; }
    .badges { display: flex; gap: 8px; margin-top: 20px; padding: 0 30px; flex-wrap: wrap; }
    .badge {
      background: #16213e; color: #fff; border-radius: 20px;
      padding: 6px 14px; font-size: 12px; display: flex; align-items: center; gap: 6px;
    }
    .badge span { background: #e74c3c; border-radius: 50%; width: 8px; height: 8px; display: inline-block; }
    #swagger-ui { max-width: 1200px; margin: 20px auto; background: #fff; border-radius: 12px; overflow: hidden; }
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info .title { color: #e74c3c; }
    .swagger-ui .opblock.opblock-get .opblock-summary-method { background: #3498db; }
    .swagger-ui .btn.execute { background: #e74c3c !important; border-color: #e74c3c !important; }
  </style>
</head>
<body>

  <div class="header">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" alt="pikachu"/>
    <div>
      <h1>Pokemon API 🎮</h1>
      <p>Microservicio REST · Node.js puro · PostgreSQL (Supabase) · Deploy en Render</p>
    </div>
  </div>

  <div class="badges">
    <div class="badge"><span></span> Node.js puro — sin frameworks</div>
    <div class="badge"><span></span> PostgreSQL en Supabase</div>
    <div class="badge"><span></span> 10 Pokemones registrados</div>
    <div class="badge"><span></span> REST API</div>
  </div>

  <div id="swagger-ui"></div>

  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      url: '/swagger.json',
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
      layout: 'BaseLayout',
      deepLinking: true,
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 1,
      tryItOutEnabled: true
    });
  </script>
</body>
</html>`;