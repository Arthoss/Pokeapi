// db.js - Usa JSON como base de datos principal
const pokemons = require('./data/pokemons.json');

async function getAllPokemons() {
  return pokemons;
}

async function getPokemonByName(name) {
  return pokemons.find(p => p.name.toLowerCase() === name.toLowerCase()) || null;
}

async function getPokemonById(id) {
  return pokemons.find(p => p.id === parseInt(id)) || null;
}

module.exports = { getAllPokemons, getPokemonByName, getPokemonById };