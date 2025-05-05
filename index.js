const express = require('express')
const cors = require('cors')
const jwtDecode = require('jwt-decode')
const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))


app.get('/', async (req, res) => {
    res.render('index')
})

app.get('/profile/:username', async (req, res) => {
    try {
        const response = await fetch(`https://express-backend-sigma.vercel.app/users/by-user/${req.params.username}`);
        const profile = await response.json();

        const posts = await fetch(`https://express-backend-sigma.vercel.app/posts`);
        const postsJson = await posts.json();
        const filteredPosts = postsJson.filter(post => post.author && post.author.username === req.params.username);

        if (profile && profile.username) {
            res.render('profile', { profile, posts: filteredPosts });
        } else {
            res.status(404).send('Profile not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/posts/:id', async (req, res) => {
    const postId = req.params.id;
    try {
        const postRes = await fetch(`https://express-backend-sigma.vercel.app/posts/${postId}`);
        const post = await postRes.json();

        const commentsRes = await fetch(`https://express-backend-sigma.vercel.app/comments/${postId}`);
        const comments = await commentsRes.json();

        const likesRes = await fetch(`https://express-backend-sigma.vercel.app/likes?postId=${postId}&number=true`);
        const likesData = await likesRes.json();
        const likeCount = likesData.count || 0;
        res.render('post', { post, comments, likeCount });
    } catch (err) {
        console.error('Failed to fetch post, comments, or likes:', err);
        res.status(500).send('Error loading post');
    }
});

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.get('/dashboard', (req, res) => {
    res.render('dashboard') 
})

app.get('/create', (req, res) => {
    res.render('create-post')
});

app.listen(3000, () => {
    console.log('server is running on http://localhost:3000')
})
