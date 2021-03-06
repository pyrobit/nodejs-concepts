const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();




app.use(express.json());
app.use(cors());


const repositories = [];

// Middleware
function validateId(request, response, next){
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({ error: 'Bad Request'});
  }
  return next();
}

app.use('/repositories/:id',validateId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo ={ 
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(repo);
  return response.json(repo);

});

app.put("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs, likes, } = request.body;

  const repoIndex = repositories.findIndex(repository => repository.id == id);

  if (repoIndex < 0){
    return response.status(400).json({ error: "Repository not found"});
  }
  
  const repo = {
    id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes,
  }
  repositories[repoIndex] = repo;
  return response.json(repo);


});

app.delete("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex( repo => repo.id == id);
  
  if (repoIndex < 0){
    return response.status(400).json({ error: 'Repository not found'});
  }
  repositories.splice(repoIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const repository = repositories.find(repository => repository.id === id);
  if(!repository){
    return response.status(400).send();
  }
  repository.likes ++;

  return response.json(repository);
});

module.exports = app;