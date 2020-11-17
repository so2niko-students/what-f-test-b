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

app.post('/api/accounts/reg', ((req, res) => {
  fs.readFile('./mocks/users.json', ((err, data) => {
    if (err) {
      req.status(500).send('Server error occured');
    }
    const {email, firstName, lastName, password, confirmPas} = req.body;
    const users = JSON.parse(data);
    const existingUser = users.find((user) => user.email === email);
    const maxIdUsers = users.reduce((prev, cur) => {
      if(prev.id > cur.id) {
        return prev.id;
      } else {
        return cur.id;
      }
    });

    if (existingUser) {
      res.status(409).send('User already exists');
    } else if (password !== confirmPas) {
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

app.post('/api/accounts/auth', ((req, res) => {
  fs.readFile('./mocks/users.json', ((err, data) => {
    if (err) {
      res.status(500).send('Server error occurred');
    }
    const { email, password } = req.body;
    const users = JSON.parse(data.toString());
    const requestedUser = users.find((user) => user.email === email);

    if (!requestedUser) {
      res.status(400).send('User not found');
    } else if (requestedUser.password !== password) {
      res.status(403).send('Password incorrect');
    } else {
      res.header('Authorization', 'Bearer *valid jwt should be here*');
      res.header('Access-Control-Expose-Headers', 'x-tokenAuthorization');

      const { firstName, lastName, role, id } = requestedUser;
      const responseData = {
        firstName,
        lastName,
        role,
        id,
      };

      res.send(responseData);
    }
  }));
}));

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
