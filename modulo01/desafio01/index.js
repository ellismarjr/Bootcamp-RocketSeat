const express = require("express");

const server = express();

server.use(express.json());

const projects = [{ id: "1", title: "Project 1", tasks: [] }];
let numberOfRequest = 0;
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(projects => projects.id === id);

  if (!project) {
    return res.status(400).json({ error: "Project not exist" });
  }

  return next();
}

function logRequests(req, res, next) {
  numberOfRequest++;

  console.log(`Number of requests: ${numberOfRequest}`);
  return next();
}

server.use(logRequests);

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title, tasks } = req.body;

  projects.push({ id: id, title: title, tasks: tasks });

  return res.json(projects);
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(projects => projects.id === id);

  project.tasks.push(title);

  return res.json(project);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const index = projects.findIndex(projects => projects.id === id);

  projects[index].title = title;
  return res.json(projects[index]);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(projects => projects.id === id);

  projects.splice(index, 1);
  return res.json();
});

server.listen(3000);
