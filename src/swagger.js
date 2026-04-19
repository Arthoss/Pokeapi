// swagger.js - Definición OpenAPI 3.0
module.exports = {
  openapi: "3.0.0",
  info: {
    title: "Pokemon API",
    version: "1.0.0",
    description: "Microservicio REST para consultar información de Pokemones. Backend en Node.js puro con soporte PostgreSQL (Supabase) y fallback a JSON.",
    contact: { name: "Pokemon API" }
  },
  servers: [
    { url: "/", description: "Servidor actual" }
  ],
  tags: [
    { name: "Pokemons", description: "Operaciones sobre pokemones" }
  ],
  paths: {
    "/api/pokemons": {
      get: {
        tags: ["Pokemons"],
        summary: "Listar todos los pokemones",
        description: "Retorna la lista completa de los 10 pokemones registrados",
        responses: {
          "200": {
            description: "Lista de pokemones",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Pokemon" }
                    },
                    total: { type: "integer", example: 10 }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/pokemons/{id}": {
      get: {
        tags: ["Pokemons"],
        summary: "Obtener pokemon por ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID del pokemon (1-10)"
          }
        ],
        responses: {
          "200": {
            description: "Pokemon encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/Pokemon" } }
                }
              }
            }
          },
          "404": { description: "Pokemon no encontrado" }
        }
      }
    },
    "/api/pokemon/{name}": {
      get: {
        tags: ["Pokemons"],
        summary: "Buscar pokemon por nombre",
        parameters: [
          {
            name: "name",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Nombre del pokemon (ej: pikachu)"
          }
        ],
        responses: {
          "200": {
            description: "Pokemon encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/Pokemon" } }
                }
              }
            }
          },
          "404": { description: "Pokemon no encontrado" }
        }
      }
    }
  },
  components: {
    schemas: {
      Pokemon: {
        type: "object",
        properties: {
          id: { type: "integer", example: 4 },
          name: { type: "string", example: "pikachu" },
          height: { type: "integer", example: 4, description: "Altura en decímetros" },
          weight: { type: "integer", example: 60, description: "Peso en hectogramos" },
          image_front: { type: "string", format: "uri", example: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" },
          image_back: { type: "string", format: "uri", example: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png" },
          image_shiny: { type: "string", format: "uri", example: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/25.png" },
          types: {
            type: "array",
            items: { type: "string" },
            example: ["electric"]
          }
        }
      }
    }
  }
};
