const express = require("express");

const server = express();

server.use(express.json());

const projects = [{ id: "1", title: "Projeto 01", tasks: [] }];
let numberOfRequests = 0;

function checkProjectExist(req, res, next) {
  const { id } = req.params;

  const project = projects.find(projects => projects.id === id);

  if (!project) {
    return res.status(400).send({ error: "Project not found" });
  }

  return next();
}

function logRequests(req, res, next) {
  numberOfRequests++;
  console.log(`Number requests: ${numberOfRequests}`);

  return next();
}

server.use(logRequests);

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title, task } = req.body;

  projects.push({ id: id, title: title, tasks: task });
  return res.json(projects);
});

server.post("/projects/:id/tasks", checkProjectExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.tasks.push(title);
  return res.json(project);
});

server.put("/projects/:id", checkProjectExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const index = projects.findIndex(projects => projects.id === id);

  projects[index].title = title;
  return res.json(projects[index]);
});

server.delete("/projects/:id", checkProjectExist, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(projects => projects.id === id);

  projects.splice(index, 1);
  return res.json();
});

server.listen(3333);
