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

  const project = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(project);

  return response.json(project)

});

app.put("/repositories/:id", (request, response) => {

  const { title, url, techs } = request.body,
        { id } = request.params;

  const projectIndex = repositories.findIndex(project => project.id === id);

  if (projectIndex < 0 ) {
    return response.status(400).json({error: "Index not found!"})
  }

  atualProject = repositories[projectIndex];

  repositories[projectIndex] = {...atualProject, title, url, techs };

  return response.json(repositories[projectIndex]);
  
});

app.delete("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body,
        { id } = request.params;

  const projectIndex = repositories.findIndex(project => project.id === id);

  if (projectIndex < 0 ) {
    return response.status(400).json({error: "Index not found!"})
  }
  
  repositories.splice(projectIndex, 1);

  return response.status(204).send();
  
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({error: "Index not founded!"});
  }

  atualProject = repositories[projectIndex];

  repositories[projectIndex].likes++;

  return response.status(200).json(repositories[projectIndex]);

});

module.exports = app;
