const express = require('express');
const path = require('path');  
const app = express();

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, '../views')); 

app.get('/', (req, res) => {
  res.status(200).render('index');
});

app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).send('Something went wrong!');
});

module.exports = (req, res) => app(req, res);
