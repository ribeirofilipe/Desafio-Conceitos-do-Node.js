const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateRepoID(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({error: 'Invalid repo ID'});
  }

  return next();
}

app.use('/repositories/:id', validateRepoID);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repo);

  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repo not found'});
  }

  const oldRepo = repositories.find(repo => repo.id === id);

  const repo = {
    id,
    title,
    url,
    techs,
    likes: oldRepo.likes,
  };

  repositories[repoIndex] = repo;

  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repo not found'});
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.put("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repo not found'});
  }

  let repo = repositories.find(repo => repo.id === id);

  repo.likes = repo.likes + 1;

  repositories[repoIndex] = repo;

  return response.json(repo);
});

module.exports = app;
