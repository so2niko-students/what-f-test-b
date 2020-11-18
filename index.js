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

app.get('/api/courses', ((req, res) => {
  fs.readFile('./mocks/courses.json', ((err, data) => {
    if (err) {
      req.status(500).send('Server error occured');
    } else {
      const responseData = JSON.parse(data);
      res.send(responseData);
    }
  }));
}));

app.post('/api/courses', ((req, res) => {
  fs.readFile('./mocks/courses.json', ((err, data) => {
    if (err) {
      req.status(500).send('Server error occured');
    }
    const {name} = req.body;
    const courses = JSON.parse(data);
    const existingCourse = courses.find((course) => course.name === name);

    if(existingCourse) {
      res.status(409).send('Course already exists');
    } else {
      const responseData = {
        name,
      }
      res.send(responseData);
    }
  }));
}));

app.put('/api/courses/:id', ((req, res) => {
  const courseId = Number(req.params.id);
  const {name, id} = req.body;

  fs.readFile('./mocks/courses.json', ((err, data) => {
    if(err) {
      res.status(500).send('Server error occured');
    }

    const courses = JSON.parse(data.toString());
    const course = courses.find((course) => course.id === courseId);
    if (course) {
      res.send(`course with id ${courseId} is edited`);
    } else {
      res.status(403).send(`There is no course with id ${courseId}`);
    }
  }));
}));

app.delete('/api/courses/:id', ((req, res) => {
  const id = Number(req.params.id);

  fs.readFile('./mocks/courses.json', ((err, data) => {
    if(err) {
      res.status(500).send('Server error occured');
    }
    const courses = JSON.parse(data.toString());
    const course = courses.find((course) => course.id === id);

    if(course) {
      res.send(`Course with id ${id} is deleted`);
    } else {
      res.status(403).send(`There is no course with id ${id}`);
    }
  }));
}));

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
