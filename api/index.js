const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');  
app.get('/', (req, res) => {
  res.status(200).render('index');
});

module.exports = (req, res) => app(req, res);
