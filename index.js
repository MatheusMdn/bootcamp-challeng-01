const express = require("express");

const server = express();
server.use(express.json());

const projects = [];

function logRequests(req, res, next) {
  console.count("Numero de Requisições");

  return next();
}
server.use(logRequests);

function checkProjectExits(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id === id);

  if (!project) {
    return res.status(400).json({ error: "Project Not Found" });
  }

  return next();
}

server.get("/projects", (_, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project);

  return res.json(project);
});

server.put("/projects/:id", checkProjectExits, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id === id);

  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkProjectExits, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id === id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.post("/projects/:id/tasks", checkProjectExits, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(4000);
