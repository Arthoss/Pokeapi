// swagger.js - Documentación OpenAPI 3.0 para Anime API
module.exports = {
  openapi: "3.0.0",
  info: {
    title: "Anime API",
    version: "1.0.0",
    description: "API REST para consultar personajes de anime (Saint Seiya, Hunter × Hunter, One Piece) con sus imágenes. Backend en Node.js puro conectado a Supabase PostgreSQL.",
    contact: { name: "Anime API" }
  },
  servers: [
    { url: "/", description: "Servidor local (localhost:3000)" }
  ],
  tags: [
    { name: "General",    description: "Health check y estado de la API" },
    { name: "Animes",     description: "Listado de animes disponibles" },
    { name: "Personajes", description: "Consulta de personajes por nombre o anime" },
    { name: "Imágenes",   description: "Imágenes (poses) de cada personaje" }
  ],
  paths: {

    // ── / ────────────────────────────────────────────────────────────────────
    "/": {
      get: {
        tags: ["General"],
        summary: "Health check",
        description: "Verifica que la API esté corriendo y lista todos los endpoints disponibles",
        responses: {
          "200": {
            description: "API funcionando",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status:    { type: "string", example: "ok" },
                    message:   { type: "string", example: "🎌 Anime API funcionando" },
                    docs:      { type: "string", example: "/docs" },
                    endpoints: { type: "array", items: { type: "string" } }
                  }
                }
              }
            }
          }
        }
      }
    },

    // ── /api/animes ──────────────────────────────────────────────────────────
    "/api/animes": {
      get: {
        tags: ["Animes"],
        summary: "Listar todos los animes",
        description: "Retorna los animes disponibles con el total de personajes registrados en cada uno",
        responses: {
          "200": {
            description: "Lista de animes",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Anime" }
                    },
                    total: { type: "integer", example: 3 }
                  }
                },
                example: {
                  data: [
                    { anime: "hunter_x_hunter", total_personajes: "10" },
                    { anime: "one_piece",        total_personajes: "10" },
                    { anime: "saint_seiya",      total_personajes: "10" }
                  ],
                  total: 3
                }
              }
            }
          }
        }
      }
    },

    // ── /api/personajes ──────────────────────────────────────────────────────
    "/api/personajes": {
      get: {
        tags: ["Personajes"],
        summary: "Listar todos los personajes",
        description: "Retorna los 30 personajes registrados (10 por anime) con el total de imágenes de cada uno",
        responses: {
          "200": {
            description: "Lista completa de personajes",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Personaje" }
                    },
                    total: { type: "integer", example: 30 }
                  }
                }
              }
            }
          }
        }
      }
    },

    // ── /api/personajes/{nombre} ─────────────────────────────────────────────
    "/api/personajes/{nombre}": {
      get: {
        tags: ["Personajes"],
        summary: "Buscar personaje por nombre",
        description: "Retorna los datos completos de un personaje buscando por nombre (no distingue mayúsculas/minúsculas). Incluye el total de imágenes registradas.",
        parameters: [
          {
            name: "nombre",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Nombre del personaje",
            example: "Seiya"
          }
        ],
        responses: {
          "200": {
            description: "Personaje encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { $ref: "#/components/schemas/Personaje" }
                  }
                },
                example: {
                  data: {
                    id: 1,
                    nombre: "Seiya",
                    anime: "saint_seiya",
                    edad: "13 años",
                    poder_tecnica: "Meteoro de Pegaso",
                    origen: "Japón",
                    descripcion: "Caballero de Pegaso, uno de los Santos de Atenea",
                    total_imagenes: "4"
                  }
                }
              }
            }
          },
          "404": {
            description: "Personaje no encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error404" },
                example: {
                  error: "Personaje \"Pikachu\" no encontrado",
                  sugerencia: "Verifica la ortografía del nombre"
                }
              }
            }
          }
        }
      }
    },

    // ── /api/personajes/anime/{anime} ────────────────────────────────────────
    "/api/personajes/anime/{anime}": {
      get: {
        tags: ["Personajes"],
        summary: "Listar personajes por anime",
        description: "Retorna todos los personajes de un anime específico",
        parameters: [
          {
            name: "anime",
            in: "path",
            required: true,
            schema: {
              type: "string",
              enum: ["saint_seiya", "hunter_x_hunter", "one_piece"]
            },
            description: "Identificador del anime",
            example: "saint_seiya"
          }
        ],
        responses: {
          "200": {
            description: "Personajes del anime",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    anime: { type: "string", example: "saint_seiya" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Personaje" }
                    },
                    total: { type: "integer", example: 10 }
                  }
                }
              }
            }
          },
          "404": {
            description: "Anime no encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error404" }
              }
            }
          }
        }
      }
    },

    // ── /api/personajes/{nombre}/imagenes ────────────────────────────────────
    "/api/personajes/{nombre}/imagenes": {
      get: {
        tags: ["Imágenes"],
        summary: "Obtener imágenes de un personaje",
        description: "Retorna las 4 poses (imágenes) registradas para el personaje indicado con sus URLs de Supabase Storage",
        parameters: [
          {
            name: "nombre",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Nombre del personaje",
            example: "Seiya"
          }
        ],
        responses: {
          "200": {
            description: "Imágenes del personaje",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    personaje: { type: "string", example: "Seiya" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Imagen" }
                    },
                    total: { type: "integer", example: 4 }
                  }
                },
                example: {
                  personaje: "Seiya",
                  data: [
                    { id: 1, url: "https://[project].supabase.co/storage/v1/object/public/anime-images/saint_seiya/Seiya/pose1.jpg", descripcion: "Pose 1", pose_numero: 1, nombre: "Seiya", anime: "saint_seiya" },
                    { id: 2, url: "https://[project].supabase.co/storage/v1/object/public/anime-images/saint_seiya/Seiya/pose2.jpg", descripcion: "Pose 2", pose_numero: 2, nombre: "Seiya", anime: "saint_seiya" }
                  ],
                  total: 4
                }
              }
            }
          },
          "404": {
            description: "No se encontraron imágenes",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error404" }
              }
            }
          }
        }
      }
    }

  },

  // ── Schemas ─────────────────────────────────────────────────────────────────
  components: {
    schemas: {
      Anime: {
        type: "object",
        properties: {
          anime:             { type: "string",  example: "saint_seiya" },
          total_personajes:  { type: "string",  example: "10" }
        }
      },
      Personaje: {
        type: "object",
        properties: {
          id:             { type: "integer", example: 1 },
          nombre:         { type: "string",  example: "Seiya" },
          anime:          { type: "string",  example: "saint_seiya" },
          edad:           { type: "string",  example: "13 años" },
          poder_tecnica:  { type: "string",  example: "Meteoro de Pegaso" },
          origen:         { type: "string",  example: "Japón" },
          descripcion:    { type: "string",  example: "Caballero de Pegaso, uno de los Santos de Atenea" },
          total_imagenes: { type: "string",  example: "4" }
        }
      },
      Imagen: {
        type: "object",
        properties: {
          id:          { type: "integer", example: 1 },
          url:         { type: "string",  example: "https://[project].supabase.co/storage/v1/object/public/anime-images/saint_seiya/Seiya/pose1.jpg" },
          descripcion: { type: "string",  example: "Pose 1" },
          pose_numero: { type: "integer", example: 1 },
          nombre:      { type: "string",  example: "Seiya" },
          anime:       { type: "string",  example: "saint_seiya" }
        }
      },
      Error404: {
        type: "object",
        properties: {
          error:      { type: "string", example: "Personaje no encontrado" },
          sugerencia: { type: "string", example: "Verifica la ortografía del nombre" }
        }
      }
    }
  }
};