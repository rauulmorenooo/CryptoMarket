// Package imports
import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import mongoose from 'mongoose';

// User imports
import User from '../models/user';
import { isValidFirstName, isValidLastName, isValidUsername, 
        isValidEmail, isValidPassword } from '../services/Validator';

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
    let registered = false;

    // Check if user is already registered
    await User.find({ $or: [ {email: req.body.email },{ username: req.body.username }]}, 'email username', (err, result) => {
        if (err) {
            console.log('error');
            return res.status(500).json({
                status: 'ERROR',
                code: -1,
                msg: 'An error has occured ' + err
            });
        }

        if (result.length !== 0) {
            registered = true;

            if (req.body.email == result[0].email) {
                if (req.body.username == result[0].username) {
                    return res.status(200).json({
                        status: 'ERROR',
                        code: 1,
                        msg: 'User alredy exist on database'
                    });
                }

                return res.status(200).json({
                    status: 'ERROR',
                    code: 2,
                    msg: 'User alredy exist on database'
                });
            } else {
                if (req.body.username == result[0].username) {
                    return res.status(200).json({
                        status: 'ERROR',
                        code: 3,
                        msg: 'User alredy exist on database'
                    });
                }
            }
        }
    });

    if (!registered) {
        // User does not exist on database so we validate the data and insert if everything is okey
        let emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        let valid = true;
        let codes = [];
        let errors = [];

        if (req.body.fname == null || !isValidFirstName(req.body.fname)) {
            valid = false;
            codes.push(4);
            errors.push('Error with field First Name');
        }

        if (req.body.lname == null || !isValidPassword(req.body.lname)) {
            valid = false;
            codes.push(5);
            errors.push('Error with field Last Name');
        }

        if (req.body.username == null || !isValidUsername(req.body.username)) {
            valid = false;
            codes.push(6);
            errors.push('Error with field Username');
        }

        if (req.body.email == null || !isValidEmail(req.body.email)) {
            valid = false;
            codes.push(7);
            errors.push('Error with field Email');
        }

        if (req.body.pwd == null || req.body.rpwd == null || !isValidPassword(req.body.pwd) ||
            !isValidPassword(req.body.rpwd) || (req.body.pwd != req.body.rpwd)) {
                valid = false;
                codes.push(8);
                errors.push('Error with field password and/or repeat password');
        }

        if (valid) {
            bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
                if (err) {
                    return res.status(500).json({
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
                    }, (err, result) => {
                        if (err) return console.log(err);
                        console.log('Inserted document with ID: ' + result.id); // TODO: Remove when deploying to prod.
                    });

                    return res.status(200).json({
                        status: 'OK',
                        code: 0,
                        msg: 'User created'
                    })
                });
            })

        } else {
            return res.status(200).json({
                status: 'ERROR',
                code: codes,
                msg: errors
            });
        }
    }
});

// Delete user
router.delete('/user/:id', async (req, res) => {
    //req.params.id
    await User.deleteOne({ _id: req.params.id}, (err, result) => {
        if (err) {
            console.error('ERROR: ' + err);
            return res.json({
                status: 'ERROR',
                code: -1,
                msg: 'An error has ocurred deleting user -> ' + req.params.id + '\n' + err
            });
        }

        if (result.deletedCount == 0) {
            return res.status(200).json({
                status: 'ERROR',
                code: 1,
                msg: 'No user deleted, there was not a match with user ID -> ' + req.params.id
            });
        } 

        return res.json({
            status: 'OK',
            code: 0,
            msg: 'Deleted user -> ' + req.params.id
        });
    });
});

// User login
router.get('/user/login', async (req, res) => {
    await User.find({ email: req.body.email }, 'email password', (err, result) => {
        if (err) {
            console.log('ERROR: ' + err);
            return res.status(500).json({
                status: 'ERROR',
                code: -1,
                msg: 'An error has occured ' + err
            });
        }

        if (result.length !== 0) {
            bcrypt.compare(req.body.pwd, result[0].password, (err, r) => {
                if (r) return res.status(200).json({
                    status: 'OK',
                    code: 0,
                    msg: 'Credentials correct'
                });
                else return res.status(200).json({
                    status: 'ERROR',
                    code: 1,
                    msg: 'Password or email are incorrect'
                });
            });
        } else {
            return res.status(200).json({
                status: 'ERROR',
                code: 2,
                msg: 'Password or email are incorrect'
            });
        }
    });
});

// User Profile
router.get('/user/:id', async (req, res) => {
    await User.findById(req.params.id, 'first_name last_name username email investments' ,(err, result) => {
        if (err) {
            console.log('ERROR: ' + err);
            return res.status(500).json({
                status: 'ERROR',
                code: -1,
                msg: 'An error has occured ' + err
            });
        }

        return res.status(200).json({
            fname: result.first_name,
            lname: result.last_name,
            username: result.username,
            email: result.email,
            investments: result.investments
        });
    })
});

// Change user data
router.put('/user/:id', async (req, res) => {
    
    let u = {};

    if (req.body.fname != null && isValidFirstName(req.body.fname)) {
        u.first_name = req.body.fname;
    }

    if (req.body.lname != null && isValidPassword(req.body.lname)) {
        u.last_name = req.body.lname;
    }

    if (req.body.username != null && isValidUsername(req.body.username)) {
        u.username = req.body.username;
    }

    if (req.body.email != null && isValidEmail(req.body.email)) {
        u.email = req.body.email;
    }

    let user = await User.findById(req.params.id, (err, result) => { });
    await user.updateOne(u, (err, result) => {
        if (err) {
            res.status(500).json({
                status: 'ERROR',
                code: -1,
                msg: 'An error has occured ' + err
            });
        }    

        if (result.ok == 1) {
            res.status(200).json({
                status: 'OK',
                code: 0,
                msg: 'User has been updated'
            });
        }
    });

});

// Change user password
router.put('/user/:id/password', async (req, res) => {


    let u = { };

    if (req.body.opwd != null && req.body.pwd != null && req.body.rpwd != null) {
        if (isValidPassword(req.body.opwd) && isValidPassword(req.body.pwd) &&
            isValidPassword(req.body.rpwd) && (req.body.pwd == req.body.rpwd)) {
                let user = await User.findById(req.params.id, 'password', (err, result) => {
                    bcrypt.compare(req.body.opwd, result.password, (err, r) => {
                        if (r) {
                            bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
                                if (err) {
                                    res.status(500).json({
                                        status: 'ERROR',
                                        code: -1,
                                        msg: 'An error has occured ' + err
                                    });
                                }   

                                bcrypt.hash(req.body.pwd, salt, null, (err, hash) => {
                                    if (err) return res.status(500).json({
                                        status: 'ERROR',
                                        code: -1,
                                        msg: 'An error has ocurred ' + err
                                    });

                                    u.password = hash;
                                });

                            });
                        } else {
                            return res.status(200).json({
                                status: 'ERROR',
                                code: 1,
                                msg: 'Error updating password'
                            });
                        }
                    });
                });

                await user.updateOne(u, (err, re) => {
                    if (err) {
                        res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has occured ' + err
                        });
                    }    
            
                    if (re.ok == 1) {
                        res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: 'User password has been updated'
                        });
                    }
                });
            } else {
                return res.status(200).json({
                    status: 'ERROR',
                    code: 1,
                    msg: 'Error updating password'
                });
            }
    } else {
        return res.status(200).json({
            status: 'ERROR',
            code: 1,
            msg: 'Error updating password'
        });
    }

    let user = await User.findById(req.params.id, (err, result) => {
        // Check if request body contains opwd, pwd and rpwd to update the password
        if ((req.body.opwd != null || req.body.opwd != '' || (req.body.opwd > 6 && req.body.opwd < 20)) && 
        (req.body.pwd != null || req.body.pwd != '' || (req.body.pwd > 6 && req.body.pwd < 20)) &&
        (req.body.rpwd != null || req.body.rpwd != '' || (req.body.rpwd > 6 && req.body.rpwd < 20)) &&
        (req.body.pwd == req.body.rpwd)) {
            bcrypt.compare(req.body.opwd, result.password, (err, r) => {
                if (r) {

                }

            });
        }
    });
});

// Get all users info
router.get('/user', (req, res) => {

});

module.exports = router;