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
}))

app.get('/api', ((req, res) => {
  res.send('Hello from WHAT mock server!');
}));

app.get('/api/student_groups', (req, res) => {
  fs.readFile('./mocks/groups.json', ((error, data) => {
    if (error) {
      res.status(500).send('Oops! Problems with server');
    }
    const groups = JSON.parse(data.toString());
    const groupsList = groups.map((group) => {
      const {id, name, startDate, finishDate} = group;
      const resultGroup = {
        id,
        name,
        startDate,
        finishDate
      }
      return resultGroup
    });

    res.send(groupsList);
  }));
});

app.get('/api/student_groups/:id', ((req, res) => {
  const id = Number(req.params.id);
  fs.readFile('./mocks/groups.json', ((error, data) => {
    if (error) {
      res.status(500).send('Oops! Problems with server');
    }
    const groups = JSON.parse(data.toString());
    const group = groups.find((group) => group.id === id );

    res.send(group);
  }));
}));

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
