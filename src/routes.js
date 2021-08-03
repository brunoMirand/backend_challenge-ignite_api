const router = require('express').Router();
const users = require('./service/usersService');
const checksExistsUserAccount = require('./middleware/checksExistsUserAccount');
const { v4: uuid } = require('uuid');

router.get('/', (request, response) => {
  return response.status(200).json({
    message: 'Challenge-Ignite-01'
  });
});

router.post('/users', (request, response) => {
  const { name, username } = request.body;

  const userAlreadyExists = users.some(user => user.username === username);
  if (userAlreadyExists) {
    return response.status(400).json({
      error: 'Mensagem do erro'
    });
  }

  users.push({
    id: uuid(),
    name,
    username,
    todos: []
  });

  const user = users[users.length -1];

  return response.status(201).json(user);
});

router.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.status(200).json(user.todos);
});


router.post('/todos', checksExistsUserAccount, (request, response) => {
  const { body: { title, deadline }, user } = request;

  const taskData = {
    id: uuid(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };

  user.todos.push(taskData);
  const task = user.todos[user.todos.length -1];

  return response.status(201).json(task)
});

router.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { body: { title, deadline }, params: { id }, user } = request;

  const task = user.todos.find(todo => todo.id === id);
  if (!task) {
    return response.status(404).json({
      error: 'Mensagem do erro'
    });
  }

  task.title = title,
  task.deadline = new Date(deadline)

  return response.status(202).json(task);
});

router.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { params: { id }, user } = request;
  const task = user.todos.find(todo => todo.id === id);
  if (!task) {
    return response.status(404).json({
      error: 'Mensagem do erro'
    })
  }

  task.done = true;

  return response.status(202).json(task);
});

router.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { params: { id }, user } = request;
  const task = user.todos.find(todo => todo.id === id);
  if (!task) {
    return response.status(404).json({
      error: 'Mensagem de erro'
    });
  }

  user.todos.splice(task, 1);
  return response.status(204).end();
});

module.exports = router;
