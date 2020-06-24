const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateUuid(request, response, next) {
  const { id } = request.params
  if (!isUuid(id)) {
    response.status(400).json({ error: 'Invalid ID' })
  }
  return next()
}
//Validação do ID recebido
app.use("/repositories/:id", validateUuid)

// ROTAS
app.get("/repositories", (request, response) => {
  return response.json(repositories)
});
app.get("/repositories/:id", (request, response) => {
  const { id } = request.params
  const repository = repositories.find(repository => repository.id === id)
  if (!repository) {
    return response.status(404).json({ error: 'ID not found!' })
  }
  return response.json(repository)
});
app.post("/repositories", (request, response) => {
  const { id, title, url, techs } = request.body

  const repository = {
    id: id || uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository)
  return response.json(repository)
});
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  if (repositoryIndex < 0) {
    return response.status(400).send()
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: 0
  }
  repositories[ repositoryIndex ] = repository
  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).send()
  }
  repositories.splice(repositoryIndex, 1)
  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repository = repositories.find(repository => repository.id === id)
  if (!repository) {
    return response.status(400).send()
  }

  repository.likes += 1

  return response.json({ 'likes': repository.likes })
});

module.exports = app;
