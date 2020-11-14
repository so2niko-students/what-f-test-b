const express = require('express');

const PORT = 3000;
const app = express();

app.use(express.json());

app.get('/api', ((req, res) => {
  res.send('Hello from WHAT mock server!');
}));

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
