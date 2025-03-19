const express = require('express');
const axios = require('axios'); // Ensure axios is installed
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.get('/', (req, res) => {
  res.status(200).render('index');
});

app.get('/profile/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    const userResponse = await axios.get(`https://express-auth-so6r.vercel.app/users/${username}`);
    const postsResponse = await axios.get(`https://express-auth-so6r.vercel.app/posts`);

    const user = userResponse.data;
    const posts = postsResponse.data.filter(post => post.author.username === user.username);

    res.render('profile', { user, posts });
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

module.exports = (req, res) => app(req, res);
