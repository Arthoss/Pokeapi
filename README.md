# Pokemon API 🎮

Microservicio REST en **Node.js puro** (sin frameworks) para consultar 10 pokemones.

- ✅ Backend: Node.js nativo (http module)
- ✅ Base de datos: PostgreSQL (Supabase) con fallback a JSON
- ✅ Documentación: Swagger UI en `/docs`
- ✅ Deploy en la nube: Render

---

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Health check |
| GET | `/docs` | Documentación Swagger |
| GET | `/api/pokemons` | Listar todos los pokemones |
| GET | `/api/pokemons/:id` | Obtener por ID (1-10) |
| GET | `/api/pokemon/:name` | Buscar por nombre |

---

## Correr localmente

```bash
npm install
node server.js
# Visita http://localhost:3000/docs
```

---

## PASO 1 — Configurar Supabase (Base de datos PostgreSQL)

1. Ve a https://supabase.com y crea una cuenta gratuita
2. Crea un nuevo proyecto (elige región cercana, ej: South America)
3. En el dashboard, ve a **SQL Editor** y ejecuta:

```sql
CREATE TABLE IF NOT EXISTS pokemons (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  height INTEGER NOT NULL,
  weight INTEGER NOT NULL,
  image_front TEXT NOT NULL,
  image_back TEXT NOT NULL,
  image_shiny TEXT NOT NULL,
  types JSONB NOT NULL DEFAULT '[]'
);

INSERT INTO pokemons (name, height, weight, image_front, image_back, image_shiny, types) VALUES
('bulbasaur', 7, 69, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png', '["grass","poison"]'),
('charmander', 6, 85, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/4.png', '["fire"]'),
('squirtle', 5, 90, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/7.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/7.png', '["water"]'),
('pikachu', 4, 60, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/25.png', '["electric"]'),
('gengar', 15, 405, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/94.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/94.png', '["ghost","poison"]'),
('mewtwo', 20, 1220, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/150.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/150.png', '["psychic"]'),
('snorlax', 21, 4600, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/143.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/143.png', '["normal"]'),
('eevee', 3, 65, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/133.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/133.png', '["normal"]'),
('lucario', 12, 540, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/448.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/448.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/448.png', '["fighting","steel"]'),
('garchomp', 19, 950, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/445.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/445.png', '["dragon","ground"]')
ON CONFLICT (name) DO NOTHING;
```

4. Ve a **Settings > Database** y copia la **Connection String (URI)**
   - Formato: `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres`

---

## PASO 2 — Subir el código a GitHub

```bash
git init
git add .
git commit -m "feat: pokemon API inicial"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/pokemon-api.git
git push -u origin main
```

---

## PASO 3 — Deploy en Render

1. Ve a https://render.com y crea una cuenta gratuita
2. Click en **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Name**: `pokemon-api`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
5. En **Environment Variables** agrega:
   - `DATABASE_URL` = (la connection string de Supabase del paso 1)
   - `NODE_ENV` = `production`
6. Click **"Create Web Service"**

Render te dará una URL como: `https://pokemon-api-xxxx.onrender.com`

---

## PASO 4 — Conectar la app móvil

En tu app React Native/Expo, cambia la URL en `app/(tabs)/index.tsx`:

```typescript
// ANTES (PokeAPI directa)
const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);

// DESPUÉS (tu API propia)
const API_URL = 'https://pokemon-api-xxxx.onrender.com'; // tu URL de Render
const res = await fetch(`${API_URL}/api/pokemon/${name.toLowerCase()}`);
const json = await res.json();
const data = json.data; // ← tu API envuelve en { data: ... }
```

Y adaptar el mapeo de datos en el componente porque tu API usa campos directos (`image_front`, `image_back`, `image_shiny`) en vez del objeto `sprites` de PokeAPI.

---

## Estructura del proyecto

```
pokemon-api/
├── server.js          # Punto de entrada HTTP
├── package.json
└── src/
    ├── router.js      # Manejo de rutas
    ├── db.js          # Conexión PostgreSQL + fallback JSON
    ├── swagger.js     # Especificación OpenAPI 3.0
    ├── swaggerUI.js   # Página HTML con Swagger UI
    └── data/
        └── pokemons.json  # 10 pokemones (fallback)
```
