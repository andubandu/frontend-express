const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get(/^\/$/, async (req, res) => {
    res.status(200).render('index');
});

app.get(/^\/profile\/([a-zA-Z0-9_]{3,20})$/, async (req, res) => { // profile/:username
    const username = req.params[0];

    try {
        const response = await fetch(`https://express-backend-sigma.vercel.app/users/by-user/${username}`);
        const profile = await response.json();

        const posts = await fetch(`https://express-backend-sigma.vercel.app/posts`);
        const postsJson = await posts.json();
        const filteredPosts = postsJson.filter(post => post.author && post.author.username === username);

        if (profile && profile.username) {
            res.status(200).render('profile', { profile, posts: filteredPosts });
        } else {
            res.status(200).render('error', { message: 'Profile not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(200).render('error', { message: 'Error loading profile' });
    }
});

app.get(/^\/posts\/([a-fA-F0-9]{24})$/, async (req, res) => { // posts/:postId
    const postId = req.params[0];  

    try {
        const postRes = await fetch(`https://express-backend-sigma.vercel.app/posts/${postId}`);
        const post = await postRes.json();

        const commentsRes = await fetch(`https://express-backend-sigma.vercel.app/comments/${postId}`);
        const comments = await commentsRes.json();

        const likesRes = await fetch(`https://express-backend-sigma.vercel.app/likes?postId=${postId}&number=true`);
        const likesData = await likesRes.json();
        const likeCount = likesData.count || 0;

        res.status(200).render('post', { post, comments, likeCount });
    } catch (err) {
        console.error('Failed to fetch post, comments, or likes:', err);
        res.status(200).render('error', { message: 'Error loading post' });
    }
});


app.get(/^\/login$/, (req, res) => { //login
    res.status(200).render('login');
});

app.get(/^\/signup$/, (req, res) => { //signup
    res.status(200).render('signup');
});

app.get(/^\/dashboard$/, (req, res) => { //dashboard
    res.status(200).render('dashboard');
});

app.get(/^\/create$/, (req, res) => { //create 
    res.status(200).render('create-post');
});


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});