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

//--- Lessons API(GET(all) GET(by student id) PUT POST DELETE)

app.get('/api/lessons', (req, res) => {
  fs.readFile('./mocks/lessons.json', ((error, data) => {
    if (error) {
      res.send('Server error');
      throw error;
    }else{
      const lessons = JSON.parse(data.toString());
      const lessonsList = lessons.map((lesson) => {
        const {id, themeName, mentorId, lessonDate} = lesson;
        const resultLesson = {
          id,
          themeName,
          mentorId,
          lessonDate
        }
        return resultLesson
      });

      res.send(lessonsList);
    }
  }));
});

app.get('/api/lessons/students/:id', ((req, res) => {
  const studentID = Number(req.params.id);
  let student;

  fs.readFile('./mocks/students.json', ((error, data) => {
    if (error) {
      res.send('Server error');
      throw error;
    }else{

      const students = JSON.parse(data.toString());
      student = students.find((student) => student.id === studentID );

      if(!student) {
        res.status(400).send(`no student with id ${studentID}`);
      }
      fs.readFile('./mocks/lessons.json', ((error, data) => {

        if (error) {
          res.send('Server error');
          throw error;
        }else{

          const lessons = JSON.parse(data.toString());

          const studentGroups = student.studentGroupIds;

          const lessonsList = studentGroups.map((groupID)=>{
            const lessonsResult = lessons.filter(lesson=>lesson.studentGroupId === groupID);
            return [...lessonsResult];
          });

          const test = lessonsList.flat();

          const lessonsByStudentId = test.map((lesson)=>{
            const {themeName, id, lessonDate, studentGroupId} = lesson;
            const visits = lesson.lessonVisits;
            const result = visits.find((visit)=> visit.studentId === studentID);
            const { studentMark, presence, comment } = result;
            const resultObject = {
              themeName,
              id,
              studentGroupId,
              lessonDate,
              studentMark,
              presence,
              comment
            }
            return resultObject;
          });

          if(lessonsList){
            res.send(lessonsByStudentId);
          }else{
            res.status(400).send(`no lesson with id ${id}`);
          }
        }
      }));
    }
  }));
}));

app.post('/api/lessons', ((req, res) => {

  const object = req.body;

  const listOfKey = ['themeName', 'mentorId', 'studentGroupId', 'lessonVisits', 'lessonDate'];

  const result = listOfKey.map((keyL) => {
    if(object.hasOwnProperty(keyL)){
      return 'true';
    }else{
      return 'false';
    }
  }).includes('false');

  if(result){
    res.status(400).send( 'Missing properties in your object' );
  }else{
    res.send(`lesson  was created`);
  }
}));


app.put('/api/lessons/:id', ((req, res) => {

  const id = Number(req.params.id);

  const object = req.body;

  const listOfKey = ['themeName', 'lessonVisits', 'lessonDate'];

  const result = listOfKey.map((key) => {
    if(object.hasOwnProperty(key)){
      return 'true';
    }else{
      return 'false';
    }
  });

  const checkResult = result.includes('false');

  if(checkResult){
    res.status(403).send( 'Missing properties in your object' );
  }

  fs.readFile('./mocks/lessons.json', ((error, data) => {
    if (error) {
      res.send('Server error');
      throw error;
    }
    const lessons = JSON.parse(data.toString());
    const lesson = lessons.find((group) => group.id === id );

    if(lesson){
      res.send(`lesson with id ${id} was edited`);
    }else{
      res.status(403).send(`no lesson with id ${id}`);
    }
  }));
}));

app.delete('/api/lessons/:id', ((req, res) => {

  const id = Number(req.params.id);

  fs.readFile('./mocks/lessons.json', ((error, data) => {
    if (error) {
      res.send('Server error');
      throw error;
    }
    const lessons = JSON.parse(data.toString());
    const lesson = lessons.find((elem) => elem.id === id );

    if(lesson){
      res.send(`lesson with id ${id} was deleted`);
    }else{
      res.status(403).send( `no lesson with id ${id}`);
    }
  }));
}));


// Creating an account

app.post('/api/accounts/auth', ((req, res) => {
  fs.readFile('./mocks/users.json', ((err, data) => {
    if (err) {
      throw err;
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

// Courses API

app.get('/api/courses', ((req, res) => {
  fs.readFile('./mocks/courses.json', ((err, data) => {
    if (err) {
      res.send('Server error occured');
      throw err;
    } else {
      const responseData = JSON.parse(data);
      res.send(responseData);
    }
  }));
}));

app.post('/api/courses', ((req, res) => {
  fs.readFile('./mocks/courses.json', ((err, data) => {
    if (err) {
      res.send('Server error occured');
      throw err;
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
  const {name} = req.body;
  const editedCourse = {
    id: 50,
    name,
  };
  fs.readFile('./mocks/courses.json', ((err, data) => {
    if(err) {
      res.send('Server error occured');
      throw err;
    }

    const courses = JSON.parse(data.toString());
    const course = courses.find((course) => course.id === courseId);
    if (course) {
      res.send(`course with id ${courseId} is edited`);
    } else {
      res.send(`There is no course with id ${courseId}`);
    }
  }));
}));

app.delete('/api/courses/:id', ((req, res) => {
  const id = Number(req.params.id);

  fs.readFile('./mocks/courses.json', ((err, data) => {
    if(err) {
      res.send('Server error occured');
      throw err;
    }
    const courses = JSON.parse(data.toString());
    const course = courses.find((course) => course.id === id);

    if(course) {
      res.send(`Course with id ${id} is deleted`);
    } else {
      res.send(`There is no course with id ${id}`);
    }
  }));
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

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
