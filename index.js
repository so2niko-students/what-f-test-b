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
            const lessonsResult = lessons.filter(lesson=>lesson.groupId === groupID);
            return [...lessonsResult];
          });

          const test = lessonsList.flat();

          const lessonsByStudentId = test.map((lesson)=>{
            const {themeName, id, lessonDate, groupId} = lesson;
            const visits = lesson.lessonVisits;
            const result = visits.find((visit)=> visit.studentId === studentID);
            const { studentMark, presence, comment } = result;
            const resultObject = {
              themeName,
              id,
              groupId,
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

  const listOfKey = ['themeName', 'mentorId', 'groupId', 'lessonVisits', 'lessonDate'];

  const result = listOfKey.map((keyL) => {
    if(object.hasOwnProperty(keyL)){
      return 'true';
    }else{
      return 'false';
    }
  });

  const checkResult = result.includes('false');

  if(checkResult){
    res.status(400).send( 'Missing properties in your object' );
  }else{
    res.send(`lesson  was created`);
  }
}));


app.put('/api/lessons/:id', ((req, res) => {

  const id = Number(req.params.id);

  const object = req.body;

  const listOfKey = ['themeName', 'mentorId', 'lessonVisits', 'lessonDate'];

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


///--- Lessons API(GET(all) GET(by student id) PUT POST DELETE)

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
