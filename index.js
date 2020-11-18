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

//GET
app.get('/api', ((req, res) => {
    res.send('Hello from WHAT mock server!');
}));

app.get('/api/students', (req, res) => {
    fs.readFile('./mocks/students.json', ((error, data) => {
        if (error) {
            res.status(500).json({message:'Oops! Problems with server'});
        }
        const students = JSON.parse(data.toString());
        const list = students.map((student) => {
            const {id, firstName, lastName} = student;
            const result = {
                id,
                firstName,
                lastName
            }
            return result;
        });
        
        res.send(list);
    }));
});

app.get('/api/students/:id', ((req, res) => {
    const id = Number(req.params.id);
    fs.readFile('./mocks/students.json', ((error, data) => {
        if (error) {
            res.status(500).json({message:'Oops! Problems with server'});
        }
        const students = JSON.parse(data.toString());
        const student = students.find((student) => student.id === id );
        
        res.send(student);
    }));
}));

//POST
app.post('/api/students/:id', ((req, res) => {
    const id = Number(req.params.id);
    fs.readFile('./mocks/students.json', ((error, data) => {
        
        if (error) {
            res.status(500).json({message: 'Oops! Problems with server'});
        }
        const students = JSON.parse(data.toString());
        const student = students.find((student) => student.id === id);
        
        
        if (student) {
            const {id, firstName, lastName, email} = student;
            const resData = {id, firstName, lastName, email};
            res.send(resData);
        } else {
            res.status(403).json({
                message: `No student with such an id ${id} was found`,
            });
            
        }
        
    }))
}));

//PUT
app.put('/api/students/:id', ((req, res) => {
    const id = Number(req.params.id);
    const object = req.body;
    const keys = ["firstName", "lastName", "studentGroupIds", "email"]
    const result = keys.map((key) => {
        if (object.hasOwnProperty(key)) {
            return 'true';
        } else {
            return 'false';
        }
    });
    
    const checkResult = result.includes('false');
    if (checkResult) {
        res.status(403).send( { message: 'There is a missing properties in your object' });
    };

    fs.readFile('./mocks/students.json', ((error, data) => {
        if (error) {
            res.status(500).json({ message: 'Oops! Problems with server'});
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