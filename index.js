const express = require('express');
const fs = require('fs');
const app = express();
const http = require('http').Server(app);
const cors = require('express-cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Expense Tracker'
app.locals.expenses = [
  { category: 'bills', description: 'Rent', cost: '$1,000' },
  { category: 'fun', description: 'Beer', cost: '$10,000' },
  { category: 'transportation', description: 'Metrocard', cost: '$100' },
];


app.get('/', (request, response) => {
  fs.readFile(`${__dirname}/public/index.html`, (err, file) => {
    response.send(file);
  });
});

app.get('/expenses', (request, response) => {
  response.send({ expenses: app.locals.expenses });
});

app.get('/expenses/:id', (request, response) => {
  const { id } = request.params;
  const expense = app.locals.expenses.find(m => m.id == id);
  if (expense) { return response.send({ expense }); }
  return response.sendStatus(404);
});

app.post('/expenses', (request, response) => {
  const expense = request.body;
  console.log("EXPENSE: ", expense);

  for (let requiredParameter of ['category', 'cost', 'description']) {
    if (!expense[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { category: <String>, cost: <String>, description: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  expense.id = expense.id || Date.now();
  app.locals.expenses.push(expense);
  response.status(201).send({expense: expense });
});

app.put('/expenses/:id', (request, response) => {
  const { expense } = request.body;
  const { id } = request.params;
  const index = app.locals.expenses.findIndex((m) => m.id == id);

  if (index === -1) { return response.sendStatus(404); }

  const oldexpense = app.locals.expenses[index];
  app.locals.expenses[index] = Object.assign(oldexpense, expense);

  return response.sendStatus(204);
});

app.delete('/expenses/:id', (request, response) => {
  const { id } = request.params;
  if (!app.locals.expenses.find((m) => m.id == id)) {
    return response.status(404).send({
      error: 'There is no expense with the "id" of ${id}.'
    });
  }
  app.locals.expenses = app.locals.expenses.filter((m) => m.id != id);
  response.sendStatus(204);
});

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`);
  });
}

module.exports = app;
