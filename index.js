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
    return;
}));

//GET list of Students
app.get('/api/students', (req, res) => {
    fs.readFile('./mocks/students.json', ((error, data) => {
        if (error) {
            res.status(500).json({ message: 'Oops! Problems with server'});
            return;
        }
        const students = JSON.parse(data.toString());
        const list = students.map((student) => {
            const { id, firstName, lastName } = student;
            return {
                id,
                firstName,
                lastName
            }
        });
        res.send(list);
    }));
});

//GET a Student
app.get('/api/students/:id', ((req, res) => {
    const id = Number(req.params.id);
    fs.readFile('./mocks/students.json', ((error, data) => {
        if (error) {
            res.status(500).json({ message: 'Oops! Problems with server'});
            return;
        }

        const students = JSON.parse(data.toString());
        const student = students.find((student, i) => i === id);
        if (student) {
            const { email, firstName, lastName, studentGroupIds } = student;
            const resData = { email, firstName, lastName, studentGroupIds };
            res.send(resData);
        } else {
          res.status(403).json({
              message: `No student with such an id ${id} was found`,
          });
      }
      }));
}));

//POST
app.post('/api/students/:id', ((req, res) => {
    const id = Number(req.params.id);
    fs.readFile('./mocks/students.json', ((error, data) => {
        if (error) {
            res.status(500).json({ message: 'Oops! Problems with server'});
            return;
        }
        const students = JSON.parse(data.toString());
        const student = students.find((student, i) => i === id);
        
        if (student) {
            const { id, firstName, lastName, email } = student;
            const resData = { id, firstName, lastName, email };
            res.send(resData);
        } else {
            res.status(403).json({
                message: `The student with this id ${id} already exist`,
            });
        }
    }));
}));

//PUT
app.put('/api/students/:id', ((req, res) => {
    const id = Number(req.params.id);
    const keys = ['firstName', 'lastName', 'studentGroupIds', 'email'];
    for (let key of keys) {
        if (!req.body.hasOwnProperty(key)) {
            res.status(403).json({ message: 'Missing properties in your object' });
            return;
        }
    }
    
    fs.readFile('./mocks/students.json', ((error, data) => {
        if (error) {
            res.status(500).json({ message: 'Oops! Problems with server'});
            return;
        }
        const students = JSON.parse(data.toString());
        const student = students.find((student) => student.id === id );
        
        if (student) {
            res.status(200).json({
                message: `A student with id ${id} was edited`,
            });
        } else {
            res.status(403).json({
                message: `No student with such an id ${id} was found`,
            });
        }
    }));
}));

//Delete
app.delete('/api/students/:id', ((req, res) => {
    const id = Number(req.params.id);
    fs.readFile('./mocks/students.json', ((error, data) => {
        if (error) {
            res.status(500).json({ message: 'Oops! Problems with server'} );
            return;
        }
        const students = JSON.parse(data.toString());
        const student = students.find((student) => student.id === id );
        
        if (student) {
            res.status(200).json({
                message: `A student with id ${id} was excluded`,
            });
        } else {
            res.status(403).json({
                message: `No student with such an id ${id} was found`,
            });
        }
    }));
}));

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));