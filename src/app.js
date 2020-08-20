const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

function logRequests(req, res, next) {
  const { method, url } = req;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);

  next();

}

app.use(logRequests);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.json(repository)

});

app.put("/repositories/:id", (request, response) => {

  const { title, url, techs } = request.body,
        { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0 ) {
    return response.status(400).json({error: "Index not found!"})
  }

  atualrepository = repositories[repositoryIndex];

  repositories[repositoryIndex] = {...atualrepository, title, url, techs };

  return response.json(repositories[repositoryIndex]);
  
});

app.delete("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body,
        { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0 ) {
    return response.status(400).json({error: "Index not found!"})
  }
  
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
  
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({error: "Index not founded!"});
  }

  repositories[repositoryIndex].likes++;

  return response.json(repositories[repositoryIndex]);

});

module.exports = app;
