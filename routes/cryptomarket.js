const express = require('express');
const path = require('path');

const router = express.Router();

// Landing page
router.get('/', (req, res) => {
    res.send('Hello World from /');
    res.end();
});

// User Register 
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html')); // needs .. since we are on /routes folder
});

// check form data and insert user on database
router.post('/register', (req, res) => {
    console.log(req.body);
});

// User Login 
router.get('/login', (req, res) => {
    res.send('Hello World from /login');
    res.end();
});

// User dashboard
router.get('/user/:id', (req, res) => {
    res.send('Hello World from /user/*');
    res.end();
});

// User profile
router.get('/user/:id/profile', (req,res) => {
    res.send('Hello World from /user/*/profile');
    res.end();

});

// User data check and modifiy on database
router.put('/user/:id/profile', (req, res) => {

});

module.exports = router;