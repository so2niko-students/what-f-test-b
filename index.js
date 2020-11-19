const express = require('express');
const fs = require('fs');

const PORT = 3000;
const app = express();

app.use(express.json());

app.use(((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
}));

// mentors

app.get('/api/mentors', ((req, res) => {
  fs.readFile('./mocks/users.json', ((err, data) => {
    if (err) {
      throw err;
    }
    const users = JSON.parse(data);
    const mentors = users.filter((user) => user.role === 2);

    const responseData = mentors.map(({ id, firstName, lastName, email }) => ({ id, firstName, lastName, email }));

    res.send(responseData);
  }));
}));

app.post('/api/mentors/:id', ((req, res) => {
  fs.readFile('./mocks/users.json', ((err, data) => {
    if (err) {
      throw err;
    }
    const users = JSON.parse(data);
    const userId = Number(req.params.id);

    const requestedUser = users.find((user) => user.id === userId);

    if (!requestedUser) {
      res.status(400).send('User not found');
    } else if (requestedUser.role !== 0) {
      res.status(400).send('User already has a role');
    } else {
      requestedUser.role = 2;
      requestedUser.isActive = true;
      const { id, firstName, lastName, email } = requestedUser;

      const response = { id, firstName, lastName, email };
      res.send(response);
    }
  }));
}));

app.put('/api/mentors/:id', ((req, res) => {
  fs.readFile('./mocks/users.json', ((err, data) => {
    if (err) {
      throw err;
    }
    const users = JSON.parse(data);
    const userId = Number(req.params.id);

    const requestedUser = users.find((user) => user.id === userId && user.role === 2);

    if (!requestedUser) {
      res.status(400).send('Mentor not found');
    } else {
      const { email, firstName, lastName } = requestedUser;
      const responseData = {
        email: req.body.email ?? email,
        firstName: req.body.firstName ?? firstName,
        lastName: req.body.lastName ?? lastName,
      };

      res.send(responseData);
    }
  }));
}));

app.delete('/api/mentors/:id', ((req, res) => {
  fs.readFile('./mocks/users.json', ((err, data) => {
    if (err) {
      throw err;
    }
    const users = JSON.parse(data);
    const userId = Number(req.params.id);

    const requestedUser = users.find((user) => user.id === userId && user.role === 2);

    if (!requestedUser) {
      res.status(400).send('Mentor not found');
    } else {
      res.send('Successfully deleted');
    }
  }));
}));

app.get('/api', ((req, res) => {
  res.send('Hello from WHAT mock server!');
}));

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
