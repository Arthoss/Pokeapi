module.exports = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Anime API - Documentación</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0d0d1a; font-family: sans-serif; }
    .header {
      background: linear-gradient(135deg, #6c3483, #1a5276);
      padding: 22px 30px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .header-icon { font-size: 48px; line-height: 1; }
    .header h1 { color: #fff; font-size: 26px; font-weight: 700; }
    .header p  { color: rgba(255,255,255,0.8); font-size: 13px; margin-top: 4px; }
    .badges { display: flex; gap: 8px; margin: 16px 30px; flex-wrap: wrap; }
    .badge {
      background: #1a1a3e; color: #ccc; border-radius: 20px;
      padding: 6px 14px; font-size: 12px; display: flex; align-items: center; gap: 6px;
      border: 1px solid #333;
    }
    .badge span { background: #8e44ad; border-radius: 50%; width: 8px; height: 8px; display: inline-block; }
    .anime-pills { display: flex; gap: 8px; margin: 0 30px 16px; flex-wrap: wrap; }
    .pill {
      padding: 5px 16px; border-radius: 20px; font-size: 12px; font-weight: 600;
      color: #fff; letter-spacing: .5px;
    }
    .pill-ss { background: #c0392b; }
    .pill-hxh { background: #d4ac0d; color: #111; }
    .pill-op  { background: #2980b9; }
    #swagger-ui { max-width: 1200px; margin: 0 auto 40px; background: #fff; border-radius: 12px; overflow: hidden; }
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info .title { color: #6c3483; }
    .swagger-ui .opblock.opblock-get .opblock-summary-method { background: #1a5276; }
    .swagger-ui .btn.execute { background: #6c3483 !important; border-color: #6c3483 !important; }
  </style>
</head>
<body>

  <div class="header">
    <div class="header-icon">🎌</div>
    <div>
      <h1>Anime API</h1>
      <p>Microservicio REST · Node.js puro · PostgreSQL (Supabase) · Saint Seiya · Hunter × Hunter · One Piece</p>
    </div>
  </div>

  <div class="badges">
    <div class="badge"><span></span> Node.js puro — sin frameworks</div>
    <div class="badge"><span></span> PostgreSQL en Supabase</div>
    <div class="badge"><span></span> 30 personajes · 120 imágenes</div>
    <div class="badge"><span></span> 5 endpoints REST</div>
  </div>

  <div class="anime-pills">
    <span class="pill pill-ss">⚔️ Saint Seiya</span>
    <span class="pill pill-hxh">🃏 Hunter × Hunter</span>
    <span class="pill pill-op">🏴‍☠️ One Piece</span>
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