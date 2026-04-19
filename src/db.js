// db.js - Conexión a PostgreSQL con fallback a JSON
const { DATABASE_URL } = process.env;

let pool = null;

// Intentar cargar pg solo si está disponible
try {
  const { Pool } = require('pg');
  if (DATABASE_URL) {
    pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
    console.log('✅ Usando PostgreSQL como base de datos');
  }
} catch (e) {
  console.log('⚠️  pg no disponible, usando JSON como base de datos');
}

const pokemons = require('./data/pokemons.json');

async function getAllPokemons() {
  if (pool) {
    const { rows } = await pool.query('SELECT * FROM pokemons ORDER BY id');
    return rows.map(formatRow);
  }
  return pokemons;
}

async function getPokemonByName(name) {
  if (pool) {
    const { rows } = await pool.query(
      'SELECT * FROM pokemons WHERE LOWER(name) = LOWER($1)',
      [name]
    );
    return rows.length ? formatRow(rows[0]) : null;
  }
  return pokemons.find(p => p.name.toLowerCase() === name.toLowerCase()) || null;
}

async function getPokemonById(id) {
  if (pool) {
    const { rows } = await pool.query('SELECT * FROM pokemons WHERE id = $1', [id]);
    return rows.length ? formatRow(rows[0]) : null;
  }
  return pokemons.find(p => p.id === parseInt(id)) || null;
}

function formatRow(row) {
  return {
    id: row.id,
    name: row.name,
    height: row.height,
    weight: row.weight,
    image_front: row.image_front,
    image_back: row.image_back,
    image_shiny: row.image_shiny,
    types: Array.isArray(row.types) ? row.types : JSON.parse(row.types || '[]')
  };
}

// SQL para crear la tabla en Supabase (solo referencia)
const CREATE_TABLE_SQL = `
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
`;

module.exports = { getAllPokemons, getPokemonByName, getPokemonById, CREATE_TABLE_SQL };
