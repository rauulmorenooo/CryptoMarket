// Package imports
import express from 'express';
import path from 'path';
import bcrypt from 'bcrypt-nodejs';
import mongoose from 'mongoose';

// User imports
import User from '../models/user';

const SALT_ROUNDS = 10;

const mongoDB = 'mongodb://localhost:27017/cryptomarket';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const router = express.Router();

router.get('/', (req, res) => {
    return res.json({
        test: 'OK'
    });
    res.end();
});


// Validate and register user data
router.post('/user', async (req, res) => {
    console.log(req.body);
    let registered = false;

    // Check if user is already registered
    await User.find({ email: req.body.email }, 'email', (err, result) => {
        if (err) {
            console.log('error');
            return res.json({
                status: 'ERROR',
                code: -1,
                msg: 'An error has occured ' + err
            });
        }

        console.log(result);
        if (result.length !== 0) {
            registered = true;

            return res.json({
                status: 'ERROR',
                code: 1,
                msg: 'User alredy exist on database'
            });
        }
    });

    if (!registered) {
        // User does not exist on database so we validate the data and insert if everything is okey
        let emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        let valid = true;
        let codes = [];
        let errors = [];

        if (req.body.fname == null || req.body.fname == '' || req.body.fname.length > 60) {
            valid = false;
            codes.push(2)
            errors.push('Error with field First Name');
        }

        if (req.body.lname == null || req.body.lname == '' || req.body.lname.length > 60) {
            valid = false;
            codes.push(3)
            errors.push('Error with field Last Name');
        }

        if (req.body.username == null || req.body.username == '' || (req.body.username.length < 5 || req.body.username.length > 20)) {
            valid = false;
            codes.push(4)
            errors.push('Error with field Username');
        }

        if (req.body.email == null || req.body.email == '' || !emailRegex.test(req.body.email)) {
            valid = false;
            codes.push(5);
            errors.push('Error with field Email');
        }

        if (req.body.pwd == null || req.body.pwd == '' || req.body.rpwd == null || req.body.rpwd == '' ||
            req.body.pwd != req.body.rpwd || (req.body.pwd.length < 6 || req.body.pwd.length > 20) || (req.body.rpwd.length < 6 || req.body.rpwd.length > 20)) {
                valid = false;
                codes.push(6);
                errors.push('Error with field password and/or repeat password');
            }

        if (valid) {
            bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
                if (err) {
                    return res.json({
                        status: 'ERROR',
                        code: -1,
                        msg: 'An error has occured ' + err
                    });
                }

                bcrypt.hash(req.body.pwd, salt, null, async (err, hash) => {
                    await User.create({
                        first_name: req.body.fname,
                        last_name: req.body.lname,
                        username: req.body.username,
                        email: req.body.email,
                        password: hash,
                        creationDate: new Date().getDate()
                    });

                    return res.json({
                        status: 'OK',
                        code: 0,
                        msg: 'User created'
                    })
                });
            })

        } else {
            return res.json({
                status: 'ERROR',
                code: codes,
                msg: errors
            });
        }
    }
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