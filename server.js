import { fastify } from "fastify";
// import { DatabaseMemory } from "./database-memory.js";
import { DatabasePostgres } from "./database-postgres.js";

const server = fastify();

const database = new DatabasePostgres();

// GET(Busca info), POST(Cria), PUT(Altera), PATCH(Pequena alteração), DELETE

server.post("/videos", async (request, response) => {
  const { title, description, duration } = request.body;

  const newVideo = {
    title,
    description,
    duration,
  };

  await database.create(newVideo);

  return response.status(201).send(newVideo);
});

server.get("/videos", async (request, response) => {
  const search = request.query.search;
  console.log(search);

  const videos = await database.list(search);
  return response.send(videos);
});

server.put("/videos/:id", (request, response) => {
  const videoId = request.params.id;
  const { title, description, duration } = request.body;
  const video = database.update(videoId, {
    title,
    description,
    duration,
  });

  return response.status(204).send();
});

server.delete("/videos/:id", (request, response) => {
  const videoId = request.params.id;

  database.delete(videoId);

  return response.status(204).send();
});

server.listen({
  port: 3333,
});
