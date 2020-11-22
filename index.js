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

// Creating an account

app.post('/api/accounts/reg', ((req, res) => {
  fs.readFile('./mocks/users.json', ((err, data) => {
    if (err) {
      res.send('Server error occured');
      throw err;
    }
    const {email, firstName, lastName, password, confirmPassword} = req.body;
    const users = JSON.parse(data);
    const existingUser = users.find((user) => user.email === email);
    const maxIdUsers = users.reduce((prev, cur) => {
      if (prev.id > cur.id) {
        return prev.id;
      } else {
        return cur.id;
      }
    });

    if (existingUser) {
      res.status(409).send('User already exists');
    } else if (password !== confirmPassword) {
      res.status(409).send('password does not match')
    } else {
      const newUser = {
        firstName,
        lastName,
        role: 0,
        id: maxIdUsers + 1,
        email,
        password,
        isActive: false,
      };
      users.push(newUser);
      const newUsers = JSON.stringify(users);

      const responseData = {
        id: maxIdUsers + 1,
        firstName,
        lastName,
        email,
        role: 0,
        isActive: false
      };

      fs.writeFile('./mocks/users.json', newUsers, (err) => {
        if (err) throw err;
        res.status(201).send(responseData);
      })
    }
  }));
}));

//---Group API(Get(ALL),Get(By Id), Put, Post, Delete)

app.get('/api/student_groups', (req, res) => {
  fs.readFile('./mocks/groups.json', ((error, data) => {
    if (error) {
      res.send('Server error');
      throw error;
    } else {
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
    }
  }));
});

app.get('/api/student_groups/:id', ((req, res) => {
  const id = Number(req.params.id);
  fs.readFile('./mocks/groups.json', ((error, data) => {
    if (error) {
      res.send('Server error');
      throw error;
    } else {
      const groups = JSON.parse(data.toString());
      const group = groups.find((group) => group.id === id );

      res.send(group);
    }
  }));
}));

app.post('/api/student_groups', ((req, res) => {

  const object = req.body;

  const listOfKey = ['name', 'courseId', 'startDate', 'finishDate', 'studentIds'];

  fs.readFile('./mocks/groups.json', ((error, data) => {
    if (error) {
      res.send('Server error');
      throw error;
    } else {

      const groups = JSON.parse(data.toString());
      const group = groups.find((group) => group.name === object.name );

      if (group) {
        res.status(400).send( 'Group with the same name already exists' );
      }

      const result = listOfKey.map((key) => {
        if (object.hasOwnProperty(key)) {
          return 'true';
        } else {
          return 'false';
        }
      });

      const checkResult = result.includes('false');

      if (checkResult) {
        res.status(400).send( 'Missing properties in your object' );
      } else {
        const response = {
          id:100,
          ...object
        };
        res.send(response);
      }
    }
  }));
}));

app.put('/api/student_groups/:id', ((req, res) => {

  const id = Number(req.params.id);

  const object = req.body;

  const listOfKey = ['name', 'courseId', 'startDate', 'finishDate', 'studentIds'];

  const result = listOfKey.map((key) => {
    if (object.hasOwnProperty(key)) {
      return 'true';
    } else {
      return 'false';
    }
  });

  const checkResult = result.includes('false');

  if (checkResult) {
    res.status(400).send(  'Missing properties in your object');
  }

  fs.readFile('./mocks/groups.json', ((error, data) => {
    if (error) {
      res.send('Server error');
      throw error;
    } else {
      const groups = JSON.parse(data.toString());
      const group = groups.find((group) => group.id === id );

      if (group) {
        res.send(`group with id ${id} was edited`);
      } else {
        res.status(400).send( `no group with id ${id}`);
      }
    }
  }));
}));

app.delete('/api/student_groups/:id', ((req, res) => {

  const id = Number(req.params.id);

  fs.readFile('./mocks/groups.json', ((error, data) => {
    if (error) {
      res.send('Server error');
      throw error;
    } else {
      const groups = JSON.parse(data.toString());
      const group = groups.find((group) => group.id === id );

      if (group) {
        res.send(`group with id ${id} was deleted`);
      } else {
        res.status(403).send(`no group with id ${id}`);
      }
    }
  }));
}));

//---Group API(Get(ALL),Get(By Id), Put, Post, Delete)

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
