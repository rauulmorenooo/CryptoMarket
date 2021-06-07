// Package imports
import express from 'express';
import bcrypt from 'bcrypt-nodejs';
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment');

// User imports
import User from '../models/user';
import Investment from '../models/investment';
import { isValidFirstName, isValidLastName, isValidUsername, 
        isValidEmail, isValidPassword } from '../services/Validator';

const SALT_ROUNDS = 10;

// Crypto imports
import ADA from '../models/crypto/ADA';
import BCH from '../models/crypto/BCH';
import BNB from '../models/crypto/BNB';
import BTC from '../models/crypto/BTC';
import DOT from '../models/crypto/DOT';
import ETH from '../models/crypto/ETH';
import LINK from '../models/crypto/LINK';
import LTC from '../models/crypto/LTC';
import XRP from '../models/crypto/XRP';

import ADADaily from '../models/daily/ADA';
import BCHDaily from '../models/daily/BCH';
import BNBDaily from '../models/daily/BNB';
import BTCDaily from '../models/daily/BTC';
import DOTDaily from '../models/daily/DOT';
import ETHDaily from '../models/daily/ETH';
import LINKDaily from '../models/daily/LINK';
import LTCDaily from '../models/daily/LTC';
import XRPDaily from '../models/daily/XRP';

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
    console.log(req.body);

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
        let valid = true;
        let codes = [];
        let errors = [];

        if (req.body.fname == null || !isValidFirstName(req.body.fname)) {
            valid = false;
            codes.push(4);
            errors.push('Error with field First Name');
        }

        if (req.body.lname == null || !isValidLastName(req.body.lname)) {
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
                        creationDate: new Date().getDate(),
                        credits: 25000
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
router.post('/user/login', async (req, res) => {
    console.log(req.body);
    await User.find({ email: req.body.email }, 'id username email password', (err, result) => {
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
                    msg: 'Credentials correct',
                    user_id: result[0].id,
                    username: result[0].username
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
// TODO: Modificar para que siga las respuestas otras
router.get('/user/:id', async (req, res) => {
    await User.findById(req.params.id, 'first_name last_name email' ,(err, result) => {
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
            email: result.email
        });
    });
});

// Change user data
router.put('/user/:id', async (req, res) => {
    
    let password = '';
    let user = await User.findById(req.params.id, 'password', (err, result) => {
        password = result.password;
    });

    let u = {};

    if (req.body.fname != null && isValidFirstName(req.body.fname)) {
        u.first_name = req.body.fname;
    }

    if (req.body.lname != null && isValidLastName(req.body.lname)) {
        u.last_name = req.body.lname;
    }

    if (req.body.email != null && isValidEmail(req.body.email)) {
        u.email = req.body.email;
    }

    if (req.body.opwd != null && req.body.pwd != null && req.body.rpwd != null) {
        if (isValidPassword(req.body.opwd) && isValidPassword(req.body.pwd) &&
            isValidPassword(req.body.rpwd) && (req.body.pwd == req.body.rpwd)) {
                bcrypt.compare(req.body.opwd, password, (err, r) => {
                    if (r) {
                        console.log('yeeet');
                        bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
                            if (err) {
                                res.status(500).json({
                                    status: 'ERROR',
                                    code: -1,
                                    msg: 'An error has occured ' + err
                                });
                            }

                            bcrypt.hash(req.body.pwd, salt, null, async (err, hash) => {
                                if (err) return res.status(500).json({
                                    status: 'ERROR',
                                    code: -1,
                                    msg: 'An error has ocurred ' + err
                                });

                                u.password = hash;

                                console.log(u);
                                
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
                        });
                    } else {
                        return res.status(200).json({
                            status: 'ERROR',
                            code: 1,
                            msg: 'Error updating password'
                        });
                    }
                });
        }
    }
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

// Get specif symbol "present" data
router.get('/symbol/:symbol/', async (req, res) => {

});

// Get specif symbol "historic" data
router.get('/symbol/:symbol/', async (req, res) => {

});

// Get "daily" symbol data for all symbols
router.get('/symbol', async (req, res) => {
    var promises = [];
    promises.push(ADADaily.find({}, 'symbol price').sort({time: -1}).limit(1).exec());
    promises.push(BCHDaily.find({}, 'symbol price').sort({time: -1}).limit(1).exec());
    promises.push(BNBDaily.find({}, 'symbol price').sort({time: -1}).limit(1).exec());
    promises.push(BTCDaily.find({}, 'symbol price').sort({time: -1}).limit(1).exec());
    promises.push(DOTDaily.find({}, 'symbol price').sort({time: -1}).limit(1).exec());
    promises.push(ETHDaily.find({}, 'symbol price').sort({time: -1}).limit(1).exec());
    promises.push(LINKDaily.find({}, 'symbol price').sort({time: -1}).limit(1).exec());
    promises.push(LTCDaily.find({}, 'symbol price').sort({time: -1}).limit(1).exec());
    promises.push(XRPDaily.find({}, 'symbol price').sort({time: -1}).limit(1).exec());

    var cryptomarket = [];
    Promise.allSettled(promises).then((results) => {
        results.forEach(r => {
            cryptomarket.push(r.value);
        });
        res.status(200).json({
            status: 'OK',
            code: 0,
            msg: cryptomarket
        });

    }, (err) => {
        console.log(err);
        return res.status(500).json({
            status: 'ERROR',
            code: -1,
            msg: 'An error has occured ' + err
        });
    })
});

router.post('/symbol/:symbol/historic', async (req, res) => {
    var symbol = req.params.symbol;
    console.log(symbol);
    console.log(req.body);
    console.log(req.body.fdate);
    console.log(req.body.ldate);
    // Check if body is not empty
    if (req.body.fdate != null && req.body.ldate != null) {
        var firstDate = new Date(req.body.fdate);
        var lastDate = new Date(req.body.ldate);
        console.log('Symbol: ' + symbol);
        console.log('First Date: ' + firstDate);
        console.log('Last Date: ' + lastDate);

        switch (symbol) {
            case 'ADA':
                ADA.find({
                    start_time: {
                        $gte: firstDate,
                        $lte: lastDate
                    },
                    close_time: {
                        $gte: firstDate,
                        $lte: lastDate
                    }
                }).sort('start_time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        return res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: result
                        })

                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred ' + error 
                        })
                    }
                });
                break;
            case 'BCH':
                BCH.find({
                    start_time: {
                        $gte: firstDate,
                        $lte: lastDate
                    },
                    close_time: {
                        $gte: firstDate,
                        $lte: lastDate
                    }
                }).sort('start_time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        return res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: result
                        })

                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred ' + error 
                        })
                    }
                });
                break;

            case 'BNB':
                BNB.find({
                    start_time: {
                        $gte: firstDate,
                        $lte: lastDate
                    },
                    close_time: {
                        $gte: firstDate,
                        $lte: lastDate
                    }
                }).sort('start_time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        return res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: result
                        })

                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred ' + error 
                        })
                    }
                });
                break;

            case 'BTC':
                BTC.find({
                    start_time: {
                        $gte: firstDate,
                        $lte: lastDate
                    },
                    close_time: {
                        $gte: firstDate,
                        $lte: lastDate
                    }
                }).sort('start_time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        return res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: result
                        })

                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred ' + error 
                        })
                    }
                });
                break;

            case 'DOT':
                DOT.find({
                    start_time: {
                        $gte: firstDate,
                        $lte: lastDate
                    },
                    close_time: {
                        $gte: firstDate,
                        $lte: lastDate
                    }
                }).sort('start_time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        return res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: result
                        })

                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred ' + error 
                        })
                    }
                });
                break;

            case 'ETH':
                ETH.find({
                    start_time: {
                        $gte: firstDate,
                        $lte: lastDate
                    },
                    close_time: {
                        $gte: firstDate,
                        $lte: lastDate
                    }
                }).sort('start_time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        return res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: result
                        })

                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred ' + error 
                        })
                    }
                });
                break;

            case 'LINK':
                LINK.find({
                    start_time: {
                        $gte: firstDate,
                        $lte: lastDate
                    },
                    close_time: {
                        $gte: firstDate,
                        $lte: lastDate
                    }
                }).sort('start_time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        return res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: result
                        })

                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred ' + error 
                        })
                    }
                });
                break;

            case 'LTC':
                LTC.find({
                    start_time: {
                        $gte: firstDate,
                        $lte: lastDate
                    },
                    close_time: {
                        $gte: firstDate,
                        $lte: lastDate
                    }
                }).sort('start_time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        return res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: result
                        })

                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred ' + error 
                        })
                    }
                });
                break;

            case 'XRP':
                XRP.find({
                    start_time: {
                        $gte: firstDate,
                        $lte: lastDate
                    },
                    close_time: {
                        $gte: firstDate,
                        $lte: lastDate
                    }
                }).sort('start_time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        return res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: result
                        })

                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred ' + error 
                        })
                    }
                });
                break;

                default:
                    return res.status(300).json({
                        status: 'ERROR',
                        code: 1,
                        msg: 'Symbol is not correct'
                    });
                    break;
        }



    } else {
        return res.status(400).json({
            status: 'ERROR',
            code: 1,
            msg: 'Bad Request. Body must contain first and last date for the specified symbol'
        })
    }
});

//Get lastest price
router.get('/symbol/:symbol/lastest', async (req, res) => {
    var symbol = req.params.symbol;

    switch (symbol) {
        case 'ADA':
            ADADaily.find({}).sort('-time').limit(1).exec((error, result) => {
                if (result != null && result.length > 0) {
                    return res.status(200).json({
                        status: 'OK',
                        code: 0,
                        msg: result
                    })

                } else {
                    return res.status(500).json({
                        status: 'ERROR',
                        code: -1,
                        msg: 'An error has ocurred ' + error 
                    })
                }
            });
            break;
        
        case 'BCH':
            BCHDaily.find({}).sort('-time').limit(1).exec((error, result) => {
                if (result != null && result.length > 0) {
                    return res.status(200).json({
                        status: 'OK',
                        code: 0,
                        msg: result
                    })

                } else {
                    return res.status(500).json({
                        status: 'ERROR',
                        code: -1,
                        msg: 'An error has ocurred ' + error 
                    })
                }
            });
            break;
        
        case 'BNB':
            BNBDaily.find({}).sort('-time').limit(1).exec((error, result) => {
                if (result != null && result.length > 0) {
                    return res.status(200).json({
                        status: 'OK',
                        code: 0,
                        msg: result
                    })

                } else {
                    return res.status(500).json({
                        status: 'ERROR',
                        code: -1,
                        msg: 'An error has ocurred ' + error 
                    })
                }
            });
            break;
        
        case 'BTC':
            BTCDaily.find({}).sort('-time').limit(1).exec((error, result) => {
                if (result != null && result.length > 0) {
                    return res.status(200).json({
                        status: 'OK',
                        code: 0,
                        msg: result
                    })

                } else {
                    return res.status(500).json({
                        status: 'ERROR',
                        code: -1,
                        msg: 'An error has ocurred ' + error 
                    })
                }
            });
            break;
        
        case 'DOT':
            DOTDaily.find({}).sort('-time').limit(1).exec((error, result) => {
                if (result != null && result.length > 0) {
                    return res.status(200).json({
                        status: 'OK',
                        code: 0,
                        msg: result
                    })

                } else {
                    return res.status(500).json({
                        status: 'ERROR',
                        code: -1,
                        msg: 'An error has ocurred ' + error 
                    })
                }
            });
            break;
        
        case 'ETH':
            ETHDaily.find({}).sort('-time').limit(1).exec((error, result) => {
                if (result != null && result.length > 0) {
                    return res.status(200).json({
                        status: 'OK',
                        code: 0,
                        msg: result
                    })

                } else {
                    return res.status(500).json({
                        status: 'ERROR',
                        code: -1,
                        msg: 'An error has ocurred ' + error 
                    })
                }
            });
            break;
        
        case 'LINK':
            LINKDaily.find({}).sort('-time').limit(1).exec((error, result) => {
                if (result != null && result.length > 0) {
                    return res.status(200).json({
                        status: 'OK',
                        code: 0,
                        msg: result
                    })

                } else {
                    return res.status(500).json({
                        status: 'ERROR',
                        code: -1,
                        msg: 'An error has ocurred ' + error 
                    })
                }
            });
            break;
        
        case 'LTC':
            LTCDaily.find({}).sort('-time').limit(1).exec((error, result) => {
                if (result != null && result.length > 0) {
                    return res.status(200).json({
                        status: 'OK',
                        code: 0,
                        msg: result
                    })

                } else {
                    return res.status(500).json({
                        status: 'ERROR',
                        code: -1,
                        msg: 'An error has ocurred ' + error 
                    })
                }
            });
            break;
        
        case 'XRP':
            XRPDaily.find({}).sort('-time').limit(1).exec((error, result) => {
                if (result != null && result.length > 0) {
                    return res.status(200).json({
                        status: 'OK',
                        code: 0,
                        msg: result
                    })

                } else {
                    return res.status(500).json({
                        status: 'ERROR',
                        code: -1,
                        msg: 'An error has ocurred ' + error 
                    })
                }
            });
            break;
        default:
            return res.status(300).json({
                status: 'ERROR',
                code: 1,
                msg: 'Symbol is not correct'
            });
   }
});

// Get prices up to 3 months ago
router.get('/symbol/:symbol/dailychart', async (req, res) => {
    var symbol = req.params.symbol;

    var last_date = moment();
    var start_date = moment().subtract(3, 'months');

    switch (symbol) {
        case 'ADA':
            ADA.find({
                start_time: {
                    $gte: start_date
                },
                close_time: {
                    $lte: last_date
                }
            }).sort('start_date').exec((error, result) => {
                if (result != null && result.length > 0) {
                    return res.status(200).json({
                        status: 'OK',
                        code: 0,
                        msg: result
                    })

                } else {
                    return res.status(500).json({
                        status: 'ERROR',
                        code: -1,
                        msg: 'An error has ocurred ' + error 
                    })
                }
            });
            break;
        
        case 'BCH':
            BCH.find({
                start_time: {
                    $gte: start_date
                },
                close_time: {
                    $lte: last_date
                }
            }).sort('start_date').exec((error, result) => {
                if (result != null && result.length > 0) {
                    return res.status(200).json({
                        status: 'OK',
                        code: 0,
                        msg: result
                    })

                } else {
                    return res.status(500).json({
                        status: 'ERROR',
                        code: -1,
                        msg: 'An error has ocurred ' + error 
                    })
                }
            });
            break;
        
        case 'BNB':
            BNB.find({
                start_time: {
                    $gte: start_date
                },
                close_time: {
                    $lte: last_date
                }
            }).sort('start_date').exec((error, result) => {
                if (result != null && result.length > 0) {
                    return res.status(200).json({
                        status: 'OK',
                        code: 0,
                        msg: result
                    })

                } else {
                    return res.status(500).json({
                        status: 'ERROR',
                        code: -1,
                        msg: 'An error has ocurred ' + error 
                    })
                }
            });
            break;
        
        case 'BTC':
            BTC.find({
                start_time: {
                    $gte: start_date
                },
                close_time: {
                    $lte: last_date
                }
            }).sort('start_date').exec((error, result) => {
                if (result != null && result.length > 0) {
                    return res.status(200).json({
                        status: 'OK',
                        code: 0,
                        msg: result
                    })

                } else {
                    return res.status(500).json({
                        status: 'ERROR',
                        code: -1,
                        msg: 'An error has ocurred ' + error 
                    })
                }
            });
            break;
        
        case 'DOT':
            DOT.find({
                start_time: {
                    $gte: start_date
                },
                close_time: {
                    $lte: last_date
                }
            }).sort('start_date').exec((error, result) => {
                if (result != null && result.length > 0) {
                    return res.status(200).json({
                        status: 'OK',
                        code: 0,
                        msg: result
                    })

                } else {
                    return res.status(500).json({
                        status: 'ERROR',
                        code: -1,
                        msg: 'An error has ocurred ' + error 
                    })
                }
            });
            break;
        
        case 'ETH':
            ETH.find({
                start_time: {
                    $gte: start_date
                },
                close_time: {
                    $lte: last_date
                }
            }).sort('start_date').exec((error, result) => {
                if (result != null && result.length > 0) {
                    return res.status(200).json({
                        status: 'OK',
                        code: 0,
                        msg: result
                    })

                } else {
                    return res.status(500).json({
                        status: 'ERROR',
                        code: -1,
                        msg: 'An error has ocurred ' + error 
                    })
                }
            });
            break;
        
        case 'LINK':
            LINK.find({
                start_time: {
                    $gte: start_date
                },
                close_time: {
                    $lte: last_date
                }
            }).sort('start_date').exec((error, result) => {
                if (result != null && result.length > 0) {
                    return res.status(200).json({
                        status: 'OK',
                        code: 0,
                        msg: result
                    })

                } else {
                    return res.status(500).json({
                        status: 'ERROR',
                        code: -1,
                        msg: 'An error has ocurred ' + error 
                    })
                }
            });
            break;
        
        case 'LTC':
            LTC.find({
                start_time: {
                    $gte: start_date
                },
                close_time: {
                    $lte: last_date
                }
            }).sort('start_date').exec((error, result) => {
                if (result != null && result.length > 0) {
                    return res.status(200).json({
                        status: 'OK',
                        code: 0,
                        msg: result
                    })

                } else {
                    return res.status(500).json({
                        status: 'ERROR',
                        code: -1,
                        msg: 'An error has ocurred ' + error 
                    })
                }
            });
            break;
        
        case 'XRP':
            XRP.find({
                start_time: {
                    $gte: start_date
                },
                close_time: {
                    $lte: last_date
                }
            }).sort('start_date').exec((error, result) => {
                if (result != null && result.length > 0) {
                    return res.status(200).json({
                        status: 'OK',
                        code: 0,
                        msg: result
                    })

                } else {
                    return res.status(500).json({
                        status: 'ERROR',
                        code: -1,
                        msg: 'An error has ocurred ' + error 
                    })
                }
            });
            break;
   }
});

// Get prices and create intervals for data
router.post('/symbol/:symbol/daily', async (req, res) => {
    var symbol = req.params.symbol;
    var msg = [];
    if (req.body.interval != null) {
        var interval = undefined;
        var hour = false;
        switch (req.body.interval) {
            case '5m':
                interval = 5;
                break;

            case '15m':
                interval = 15;
                break;

            case '30m':
                interval = 30;
                break;

            case '1h':
                interval = 1;
                hour = true;
                break;

            case '4h':
                interval = 4;
                hour = true;
                break;

            case '12h':
                interval = 12;
                hour = true;
                break;
        }

        console.log(interval);

        switch (symbol) {
            case 'ADA':
                ADADaily.find({}).sort('time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        var interval_start, interval_end = undefined;
                        var price_start, price_end, highest = 0;
                        var lowest = Infinity;

                        if (!hour) { // Interval is in minutes
                            result.forEach(re => {
                                if (interval_start == undefined) {
                                    interval_start = new Date(re.time);
                                    price_start = re.price;
                                    lowest = re.price;
                                    highest = re.price;
                                } else {
                                    if ((new Date(re.time).getMinutes() == ((interval_start.getMinutes() + interval) % 60)) && (new Date(re.time).getSeconds() >= interval_start.getSeconds())) {
                                        interval_end = new Date(re.time);
                                        price_end = re.price;
                                        if (re.price < lowest) lowest = re.price;
                                        if (re.price > highest) highest = re.price;
                                        msg.push({
                                            start_time: interval_start,
                                            close_time: interval_end,
                                            open_price: price_start,
                                            close_price: price_end,
                                            highest: highest,
                                            lowest: lowest
                                        });
                                        // interval_start = new Date(re.time);
                                        interval_start = undefined;
                                    } else {
                                        if ((new Date(re.time).getMinutes() <= ((interval_start.getMinutes() + interval) % 60)) && (new Date(re.time).getSeconds() < interval_start.getSeconds())) {
                                            if (re.price < lowest) lowest = re.price;
                                            if (re.price > highest) highest = re.price;
                                        }
                                    }
                                }
                            });

                            console.log('MSG Length: ' + msg.length);
                            return res.status(200).json({
                                status: 'OK',
                                code: 0,
                                msg: msg
                            });
                        } else { // Interval is in hours
                            result.forEach(re => {
                                if (interval_start == undefined) {
                                    interval_start = new Date(re.time);
                                    price_start = re.price;
                                    lowest = re.price;
                                    highest = re.price;
                                } else {
                                    if ((new Date(re.time).getHours() == ((interval_start.getHours() + interval) % 24)) && (new Date(re.time).getSeconds() >= interval_start.getSeconds())) {
                                        interval_end = new Date(re.time);
                                        price_end = re.price;
                                        if (re.price < lowest) lowest = re.price;
                                        if (re.price > highest) highest = re.price;
                                        msg.push({
                                            start_time: interval_start,
                                            close_time: interval_end,
                                            open_price: price_start,
                                            close_price: price_end,
                                            highest: highest,
                                            lowest: lowest
                                        });
                                        // interval_start = new Date(re.time);
                                        interval_start = undefined;
                                    } else {
                                        if ((new Date(re.time).getHours() <= ((interval_start.getHours() + interval) % 24)) && (new Date(re.time).getSeconds() < interval_start.getSeconds())) {
                                            if (re.price < lowest) lowest = re.price;
                                            if (re.price > highest) highest = re.price;
                                        }
                                    }
                                }
                            });

                            console.log('MSG Length: ' + msg.length);
                            return res.status(200).json({
                                status: 'OK',
                                code: 0,
                                msg: msg
                            });
                        }
                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred ' + error 
                        })
                    }
                });
                break;
            
            case 'BCH':
                BCHDaily.find({}).sort('time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        var interval_start, interval_end = undefined;
                        var price_start, price_end, highest = 0;
                        var lowest = Infinity;

                        if (!hour) { // Interval is in minutes
                            result.forEach(re => {
                                if (interval_start == undefined) {
                                    interval_start = new Date(re.time);
                                    price_start = re.price;
                                    lowest = re.price;
                                    highest = re.price;
                                } else {
                                    if ((new Date(re.time).getMinutes() == ((interval_start.getMinutes() + interval) % 60)) && (new Date(re.time).getSeconds() >= interval_start.getSeconds())) {
                                        interval_end = new Date(re.time);
                                        price_end = re.price;
                                        if (re.price < lowest) lowest = re.price;
                                        if (re.price > highest) highest = re.price;
                                        msg.push({
                                            start_time: interval_start,
                                            close_time: interval_end,
                                            open_price: price_start,
                                            close_price: price_end,
                                            highest: highest,
                                            lowest: lowest
                                        });
                                        // interval_start = new Date(re.time);
                                        interval_start = undefined;
                                    } else {
                                        if ((new Date(re.time).getMinutes() <= ((interval_start.getMinutes() + interval) % 60)) && (new Date(re.time).getSeconds() < interval_start.getSeconds())) {
                                            if (re.price < lowest) lowest = re.price;
                                            if (re.price > highest) highest = re.price;
                                        }
                                    }
                                }
                            });

                            console.log('MSG Length: ' + msg.length);
                            return res.status(200).json({
                                status: 'OK',
                                code: 0,
                                msg: msg
                            });
                        } else { // Interval is in hours
                            result.forEach(re => {
                                if (interval_start == undefined) {
                                    interval_start = new Date(re.time);
                                    price_start = re.price;
                                    lowest = re.price;
                                    highest = re.price;
                                } else {
                                    if ((new Date(re.time).getHours() == ((interval_start.getHours() + interval) % 24)) && (new Date(re.time).getSeconds() >= interval_start.getSeconds())) {
                                        interval_end = new Date(re.time);
                                        price_end = re.price;
                                        if (re.price < lowest) lowest = re.price;
                                        if (re.price > highest) highest = re.price;
                                        msg.push({
                                            start_time: interval_start,
                                            close_time: interval_end,
                                            open_price: price_start,
                                            close_price: price_end,
                                            highest: highest,
                                            lowest: lowest
                                        });
                                        // interval_start = new Date(re.time);
                                        interval_start = undefined;
                                    } else {
                                        if ((new Date(re.time).getHours() <= ((interval_start.getHours() + interval) % 24)) && (new Date(re.time).getSeconds() < interval_start.getSeconds())) {
                                            if (re.price < lowest) lowest = re.price;
                                            if (re.price > highest) highest = re.price;
                                        }
                                    }
                                }
                            });

                            console.log('MSG Length: ' + msg.length);
                            return res.status(200).json({
                                status: 'OK',
                                code: 0,
                                msg: msg
                            });
                        }
                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred ' + error 
                        })
                    }
                });
                break;
            
            case 'BNB':
                BNBDaily.find({}).sort('time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        var interval_start, interval_end = undefined;
                        var price_start, price_end, highest = 0;
                        var lowest = Infinity;

                        if (!hour) { // Interval is in minutes
                            result.forEach(re => {
                                if (interval_start == undefined) {
                                    interval_start = new Date(re.time);
                                    price_start = re.price;
                                    lowest = re.price;
                                    highest = re.price;
                                } else {
                                    if ((new Date(re.time).getMinutes() == ((interval_start.getMinutes() + interval) % 60)) && (new Date(re.time).getSeconds() >= interval_start.getSeconds())) {
                                        interval_end = new Date(re.time);
                                        price_end = re.price;
                                        if (re.price < lowest) lowest = re.price;
                                        if (re.price > highest) highest = re.price;
                                        msg.push({
                                            start_time: interval_start,
                                            close_time: interval_end,
                                            open_price: price_start,
                                            close_price: price_end,
                                            highest: highest,
                                            lowest: lowest
                                        });
                                        // interval_start = new Date(re.time);
                                        interval_start = undefined;
                                    } else {
                                        if ((new Date(re.time).getMinutes() <= ((interval_start.getMinutes() + interval) % 60)) && (new Date(re.time).getSeconds() < interval_start.getSeconds())) {
                                            if (re.price < lowest) lowest = re.price;
                                            if (re.price > highest) highest = re.price;
                                        }
                                    }
                                }
                            });

                            console.log('MSG Length: ' + msg.length);
                            return res.status(200).json({
                                status: 'OK',
                                code: 0,
                                msg: msg
                            });
                        } else { // Interval is in hours
                            result.forEach(re => {
                                if (interval_start == undefined) {
                                    interval_start = new Date(re.time);
                                    price_start = re.price;
                                    lowest = re.price;
                                    highest = re.price;
                                } else {
                                    if ((new Date(re.time).getHours() == ((interval_start.getHours() + interval) % 24)) && (new Date(re.time).getSeconds() >= interval_start.getSeconds())) {
                                        interval_end = new Date(re.time);
                                        price_end = re.price;
                                        if (re.price < lowest) lowest = re.price;
                                        if (re.price > highest) highest = re.price;
                                        msg.push({
                                            start_time: interval_start,
                                            close_time: interval_end,
                                            open_price: price_start,
                                            close_price: price_end,
                                            highest: highest,
                                            lowest: lowest
                                        });
                                        // interval_start = new Date(re.time);
                                        interval_start = undefined;
                                    } else {
                                        if ((new Date(re.time).getHours() <= ((interval_start.getHours() + interval) % 24)) && (new Date(re.time).getSeconds() < interval_start.getSeconds())) {
                                            if (re.price < lowest) lowest = re.price;
                                            if (re.price > highest) highest = re.price;
                                        }
                                    }
                                }
                            });

                            console.log('MSG Length: ' + msg.length);
                            return res.status(200).json({
                                status: 'OK',
                                code: 0,
                                msg: msg
                            });
                        }
                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred ' + error 
                        })
                    }
                });
                break;

            
            case 'BTC':
                BTCDaily.find({}).sort('time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        var interval_start, interval_end = undefined;
                        var price_start, price_end, highest = 0;
                        var lowest = Infinity;

                        if (!hour) { // Interval is in minutes
                            result.forEach(re => {
                                if (interval_start == undefined) {
                                    interval_start = new Date(re.time);
                                    price_start = re.price;
                                    lowest = re.price;
                                    highest = re.price;
                                } else {
                                    if ((new Date(re.time).getMinutes() == ((interval_start.getMinutes() + interval) % 60)) && (new Date(re.time).getSeconds() >= interval_start.getSeconds())) {
                                        interval_end = new Date(re.time);
                                        price_end = re.price;
                                        if (re.price < lowest) lowest = re.price;
                                        if (re.price > highest) highest = re.price;
                                        msg.push({
                                            start_time: interval_start,
                                            close_time: interval_end,
                                            open_price: price_start,
                                            close_price: price_end,
                                            highest: highest,
                                            lowest: lowest
                                        });
                                        // interval_start = new Date(re.time);
                                        interval_start = undefined;
                                    } else {
                                        if ((new Date(re.time).getMinutes() <= ((interval_start.getMinutes() + interval) % 60)) && (new Date(re.time).getSeconds() < interval_start.getSeconds())) {
                                            if (re.price < lowest) lowest = re.price;
                                            if (re.price > highest) highest = re.price;
                                        }
                                    }
                                }
                            });

                            console.log('MSG Length: ' + msg.length);
                            return res.status(200).json({
                                status: 'OK',
                                code: 0,
                                msg: msg
                            });
                        } else { // Interval is in hours
                            result.forEach(re => {
                                if (interval_start == undefined) {
                                    interval_start = new Date(re.time);
                                    price_start = re.price;
                                    lowest = re.price;
                                    highest = re.price;
                                } else {
                                    if ((new Date(re.time).getHours() == ((interval_start.getHours() + interval) % 24)) && (new Date(re.time).getSeconds() >= interval_start.getSeconds())) {
                                        interval_end = new Date(re.time);
                                        price_end = re.price;
                                        if (re.price < lowest) lowest = re.price;
                                        if (re.price > highest) highest = re.price;
                                        msg.push({
                                            start_time: interval_start,
                                            close_time: interval_end,
                                            open_price: price_start,
                                            close_price: price_end,
                                            highest: highest,
                                            lowest: lowest
                                        });
                                        // interval_start = new Date(re.time);
                                        interval_start = undefined;
                                    } else {
                                        if ((new Date(re.time).getHours() <= ((interval_start.getHours() + interval) % 24)) && (new Date(re.time).getSeconds() < interval_start.getSeconds())) {
                                            if (re.price < lowest) lowest = re.price;
                                            if (re.price > highest) highest = re.price;
                                        }
                                    }
                                }
                            });

                            console.log('MSG Length: ' + msg.length);
                            return res.status(200).json({
                                status: 'OK',
                                code: 0,
                                msg: msg
                            });
                        }
                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred ' + error 
                        })
                    }
                });
                break;
            
            case 'DOT':
                DOTDaily.find({}).sort('time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        var interval_start, interval_end = undefined;
                        var price_start, price_end, highest = 0;
                        var lowest = Infinity;

                        if (!hour) { // Interval is in minutes
                            result.forEach(re => {
                                if (interval_start == undefined) {
                                    interval_start = new Date(re.time);
                                    price_start = re.price;
                                    lowest = re.price;
                                    highest = re.price;
                                } else {
                                    if ((new Date(re.time).getMinutes() == ((interval_start.getMinutes() + interval) % 60)) && (new Date(re.time).getSeconds() >= interval_start.getSeconds())) {
                                        interval_end = new Date(re.time);
                                        price_end = re.price;
                                        if (re.price < lowest) lowest = re.price;
                                        if (re.price > highest) highest = re.price;
                                        msg.push({
                                            start_time: interval_start,
                                            close_time: interval_end,
                                            open_price: price_start,
                                            close_price: price_end,
                                            highest: highest,
                                            lowest: lowest
                                        });
                                        // interval_start = new Date(re.time);
                                        interval_start = undefined;
                                    } else {
                                        if ((new Date(re.time).getMinutes() <= ((interval_start.getMinutes() + interval) % 60)) && (new Date(re.time).getSeconds() < interval_start.getSeconds())) {
                                            if (re.price < lowest) lowest = re.price;
                                            if (re.price > highest) highest = re.price;
                                        }
                                    }
                                }
                            });

                            console.log('MSG Length: ' + msg.length);
                            return res.status(200).json({
                                status: 'OK',
                                code: 0,
                                msg: msg
                            });
                        } else { // Interval is in hours
                            result.forEach(re => {
                                if (interval_start == undefined) {
                                    interval_start = new Date(re.time);
                                    price_start = re.price;
                                    lowest = re.price;
                                    highest = re.price;
                                } else {
                                    if ((new Date(re.time).getHours() == ((interval_start.getHours() + interval) % 24)) && (new Date(re.time).getSeconds() >= interval_start.getSeconds())) {
                                        interval_end = new Date(re.time);
                                        price_end = re.price;
                                        if (re.price < lowest) lowest = re.price;
                                        if (re.price > highest) highest = re.price;
                                        msg.push({
                                            start_time: interval_start,
                                            close_time: interval_end,
                                            open_price: price_start,
                                            close_price: price_end,
                                            highest: highest,
                                            lowest: lowest
                                        });
                                        // interval_start = new Date(re.time);
                                        interval_start = undefined;
                                    } else {
                                        if ((new Date(re.time).getHours() <= ((interval_start.getHours() + interval) % 24)) && (new Date(re.time).getSeconds() < interval_start.getSeconds())) {
                                            if (re.price < lowest) lowest = re.price;
                                            if (re.price > highest) highest = re.price;
                                        }
                                    }
                                }
                            });

                            console.log('MSG Length: ' + msg.length);
                            return res.status(200).json({
                                status: 'OK',
                                code: 0,
                                msg: msg
                            });
                        }
                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred ' + error 
                        })
                    }
                });
                break;
            
            case 'ETH':
                ETHDaily.find({}).sort('time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        var interval_start, interval_end = undefined;
                        var price_start, price_end, highest = 0;
                        var lowest = Infinity;

                        if (!hour) { // Interval is in minutes
                            result.forEach(re => {
                                if (interval_start == undefined) {
                                    interval_start = new Date(re.time);
                                    price_start = re.price;
                                    lowest = re.price;
                                    highest = re.price;
                                } else {
                                    if ((new Date(re.time).getMinutes() == ((interval_start.getMinutes() + interval) % 60)) && (new Date(re.time).getSeconds() >= interval_start.getSeconds())) {
                                        interval_end = new Date(re.time);
                                        price_end = re.price;
                                        if (re.price < lowest) lowest = re.price;
                                        if (re.price > highest) highest = re.price;
                                        msg.push({
                                            start_time: interval_start,
                                            close_time: interval_end,
                                            open_price: price_start,
                                            close_price: price_end,
                                            highest: highest,
                                            lowest: lowest
                                        });
                                        // interval_start = new Date(re.time);
                                        interval_start = undefined;
                                    } else {
                                        if ((new Date(re.time).getMinutes() <= ((interval_start.getMinutes() + interval) % 60)) && (new Date(re.time).getSeconds() < interval_start.getSeconds())) {
                                            if (re.price < lowest) lowest = re.price;
                                            if (re.price > highest) highest = re.price;
                                        }
                                    }
                                }
                            });

                            console.log('MSG Length: ' + msg.length);
                            return res.status(200).json({
                                status: 'OK',
                                code: 0,
                                msg: msg
                            });
                        } else { // Interval is in hours
                            result.forEach(re => {
                                if (interval_start == undefined) {
                                    interval_start = new Date(re.time);
                                    price_start = re.price;
                                    lowest = re.price;
                                    highest = re.price;
                                } else {
                                    if ((new Date(re.time).getHours() == ((interval_start.getHours() + interval) % 24)) && (new Date(re.time).getSeconds() >= interval_start.getSeconds())) {
                                        interval_end = new Date(re.time);
                                        price_end = re.price;
                                        if (re.price < lowest) lowest = re.price;
                                        if (re.price > highest) highest = re.price;
                                        msg.push({
                                            start_time: interval_start,
                                            close_time: interval_end,
                                            open_price: price_start,
                                            close_price: price_end,
                                            highest: highest,
                                            lowest: lowest
                                        });
                                        // interval_start = new Date(re.time);
                                        interval_start = undefined;
                                    } else {
                                        if ((new Date(re.time).getHours() <= ((interval_start.getHours() + interval) % 24)) && (new Date(re.time).getSeconds() < interval_start.getSeconds())) {
                                            if (re.price < lowest) lowest = re.price;
                                            if (re.price > highest) highest = re.price;
                                        }
                                    }
                                }
                            });

                            console.log('MSG Length: ' + msg.length);
                            return res.status(200).json({
                                status: 'OK',
                                code: 0,
                                msg: msg
                            });
                        }
                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred ' + error 
                        })
                    }
                });
                break;
            
            case 'LINK':
                LINKDaily.find({}).sort('time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        var interval_start, interval_end = undefined;
                        var price_start, price_end, highest = 0;
                        var lowest = Infinity;

                        if (!hour) { // Interval is in minutes
                            result.forEach(re => {
                                if (interval_start == undefined) {
                                    interval_start = new Date(re.time);
                                    price_start = re.price;
                                    lowest = re.price;
                                    highest = re.price;
                                } else {
                                    if ((new Date(re.time).getMinutes() == ((interval_start.getMinutes() + interval) % 60)) && (new Date(re.time).getSeconds() >= interval_start.getSeconds())) {
                                        interval_end = new Date(re.time);
                                        price_end = re.price;
                                        if (re.price < lowest) lowest = re.price;
                                        if (re.price > highest) highest = re.price;
                                        msg.push({
                                            start_time: interval_start,
                                            close_time: interval_end,
                                            open_price: price_start,
                                            close_price: price_end,
                                            highest: highest,
                                            lowest: lowest
                                        });
                                        // interval_start = new Date(re.time);
                                        interval_start = undefined;
                                    } else {
                                        if ((new Date(re.time).getMinutes() <= ((interval_start.getMinutes() + interval) % 60)) && (new Date(re.time).getSeconds() < interval_start.getSeconds())) {
                                            if (re.price < lowest) lowest = re.price;
                                            if (re.price > highest) highest = re.price;
                                        }
                                    }
                                }
                            });

                            console.log('MSG Length: ' + msg.length);
                            return res.status(200).json({
                                status: 'OK',
                                code: 0,
                                msg: msg
                            });
                        } else { // Interval is in hours
                            result.forEach(re => {
                                if (interval_start == undefined) {
                                    interval_start = new Date(re.time);
                                    price_start = re.price;
                                    lowest = re.price;
                                    highest = re.price;
                                } else {
                                    if ((new Date(re.time).getHours() == ((interval_start.getHours() + interval) % 24)) && (new Date(re.time).getSeconds() >= interval_start.getSeconds())) {
                                        interval_end = new Date(re.time);
                                        price_end = re.price;
                                        if (re.price < lowest) lowest = re.price;
                                        if (re.price > highest) highest = re.price;
                                        msg.push({
                                            start_time: interval_start,
                                            close_time: interval_end,
                                            open_price: price_start,
                                            close_price: price_end,
                                            highest: highest,
                                            lowest: lowest
                                        });
                                        // interval_start = new Date(re.time);
                                        interval_start = undefined;
                                    } else {
                                        if ((new Date(re.time).getHours() <= ((interval_start.getHours() + interval) % 24)) && (new Date(re.time).getSeconds() < interval_start.getSeconds())) {
                                            if (re.price < lowest) lowest = re.price;
                                            if (re.price > highest) highest = re.price;
                                        }
                                    }
                                }
                            });

                            console.log('MSG Length: ' + msg.length);
                            return res.status(200).json({
                                status: 'OK',
                                code: 0,
                                msg: msg
                            });
                        }
                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred ' + error 
                        })
                    }
                });
                break;
            
            case 'LTC':
                LTCDaily.find({}).sort('time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        var interval_start, interval_end = undefined;
                        var price_start, price_end, highest = 0;
                        var lowest = Infinity;

                        if (!hour) { // Interval is in minutes
                            result.forEach(re => {
                                if (interval_start == undefined) {
                                    interval_start = new Date(re.time);
                                    price_start = re.price;
                                    lowest = re.price;
                                    highest = re.price;
                                } else {
                                    if ((new Date(re.time).getMinutes() == ((interval_start.getMinutes() + interval) % 60)) && (new Date(re.time).getSeconds() >= interval_start.getSeconds())) {
                                        interval_end = new Date(re.time);
                                        price_end = re.price;
                                        if (re.price < lowest) lowest = re.price;
                                        if (re.price > highest) highest = re.price;
                                        msg.push({
                                            start_time: interval_start,
                                            close_time: interval_end,
                                            open_price: price_start,
                                            close_price: price_end,
                                            highest: highest,
                                            lowest: lowest
                                        });
                                        // interval_start = new Date(re.time);
                                        interval_start = undefined;
                                    } else {
                                        if ((new Date(re.time).getMinutes() <= ((interval_start.getMinutes() + interval) % 60)) && (new Date(re.time).getSeconds() < interval_start.getSeconds())) {
                                            if (re.price < lowest) lowest = re.price;
                                            if (re.price > highest) highest = re.price;
                                        }
                                    }
                                }
                            });

                            console.log('MSG Length: ' + msg.length);
                            return res.status(200).json({
                                status: 'OK',
                                code: 0,
                                msg: msg
                            });
                        } else { // Interval is in hours
                            result.forEach(re => {
                                if (interval_start == undefined) {
                                    interval_start = new Date(re.time);
                                    price_start = re.price;
                                    lowest = re.price;
                                    highest = re.price;
                                } else {
                                    if ((new Date(re.time).getHours() == ((interval_start.getHours() + interval) % 24)) && (new Date(re.time).getSeconds() >= interval_start.getSeconds())) {
                                        interval_end = new Date(re.time);
                                        price_end = re.price;
                                        if (re.price < lowest) lowest = re.price;
                                        if (re.price > highest) highest = re.price;
                                        msg.push({
                                            start_time: interval_start,
                                            close_time: interval_end,
                                            open_price: price_start,
                                            close_price: price_end,
                                            highest: highest,
                                            lowest: lowest
                                        });
                                        // interval_start = new Date(re.time);
                                        interval_start = undefined;
                                    } else {
                                        if ((new Date(re.time).getHours() <= ((interval_start.getHours() + interval) % 24)) && (new Date(re.time).getSeconds() < interval_start.getSeconds())) {
                                            if (re.price < lowest) lowest = re.price;
                                            if (re.price > highest) highest = re.price;
                                        }
                                    }
                                }
                            });

                            console.log('MSG Length: ' + msg.length);
                            return res.status(200).json({
                                status: 'OK',
                                code: 0,
                                msg: msg
                            });
                        }
                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred ' + error 
                        })
                    }
                });
                break;
            
            case 'XRP':
                XRPDaily.find({}).sort('time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        var interval_start, interval_end = undefined;
                        var price_start, price_end, highest = 0;
                        var lowest = Infinity;

                        if (!hour) { // Interval is in minutes
                            result.forEach(re => {
                                if (interval_start == undefined) {
                                    interval_start = new Date(re.time);
                                    price_start = re.price;
                                    lowest = re.price;
                                    highest = re.price;
                                } else {
                                    if ((new Date(re.time).getMinutes() == ((interval_start.getMinutes() + interval) % 60)) && (new Date(re.time).getSeconds() >= interval_start.getSeconds())) {
                                        interval_end = new Date(re.time);
                                        price_end = re.price;
                                        if (re.price < lowest) lowest = re.price;
                                        if (re.price > highest) highest = re.price;
                                        msg.push({
                                            start_time: interval_start,
                                            close_time: interval_end,
                                            open_price: price_start,
                                            close_price: price_end,
                                            highest: highest,
                                            lowest: lowest
                                        });
                                        // interval_start = new Date(re.time);
                                        interval_start = undefined;
                                    } else {
                                        if ((new Date(re.time).getMinutes() <= ((interval_start.getMinutes() + interval) % 60)) && (new Date(re.time).getSeconds() < interval_start.getSeconds())) {
                                            if (re.price < lowest) lowest = re.price;
                                            if (re.price > highest) highest = re.price;
                                        }
                                    }
                                }
                            });

                            console.log('MSG Length: ' + msg.length);
                            return res.status(200).json({
                                status: 'OK',
                                code: 0,
                                msg: msg
                            });
                        } else { // Interval is in hours
                            result.forEach(re => {
                                if (interval_start == undefined) {
                                    interval_start = new Date(re.time);
                                    price_start = re.price;
                                    lowest = re.price;
                                    highest = re.price;
                                } else {
                                    if ((new Date(re.time).getHours() == ((interval_start.getHours() + interval) % 24)) && (new Date(re.time).getSeconds() >= interval_start.getSeconds())) {
                                        interval_end = new Date(re.time);
                                        price_end = re.price;
                                        if (re.price < lowest) lowest = re.price;
                                        if (re.price > highest) highest = re.price;
                                        msg.push({
                                            start_time: interval_start,
                                            close_time: interval_end,
                                            open_price: price_start,
                                            close_price: price_end,
                                            highest: highest,
                                            lowest: lowest
                                        });
                                        // interval_start = new Date(re.time);
                                        interval_start = undefined;
                                    } else {
                                        if ((new Date(re.time).getHours() <= ((interval_start.getHours() + interval) % 24)) && (new Date(re.time).getSeconds() < interval_start.getSeconds())) {
                                            if (re.price < lowest) lowest = re.price;
                                            if (re.price > highest) highest = re.price;
                                        }
                                    }
                                }
                            });

                            console.log('MSG Length: ' + msg.length);
                            return res.status(200).json({
                                status: 'OK',
                                code: 0,
                                msg: msg
                            });
                        }
                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred ' + error 
                        })
                    }
                });
                break;
            
            default:
                return res.status(300).json({
                    status: 'ERROR',
                    code: 1,
                    msg: 'Symbol is not correct'
                });
                break;
        }
    } else {
        return res.status(500).json({
            status: 'ERROR',
            code: 1,
            msg: 'Interval must be set'
        })
    }
});

router.post('/symbol/:symbol/historical', async (req, res) => {
    var symbol = req.params.symbol;
    var msg = [];

    if (req.body.interval != null) {
        var interval = undefined;
        
        switch(req.body.interval) {
            case '1m':
                interval = 1;
                break;

            case '3m':
                interval = 3;
                break;

            case '6m':
                interval = 6;
                break;

            case '12m':
                interval = 12;
                break;

            default:
                return res.status(500).json({
                    status: 'ERROR',
                    code: 2,
                    msg: 'Interval is incorrect'
                });
        }

        var yesterday = moment().subtract(1, 'days');
        yesterday.set('hours', 23);
        yesterday.set('minute', 59);
        yesterday.set('second', 59);
        yesterday.set('millisecond', 999);

        var start = moment().subtract(interval, 'months');
        start.set('hours', 0);
        start.set('minute', 0);
        start.set('second', 0);
        start.set('millisecond', 0);

        switch (symbol) {
            case 'ADA':
                ADA.find({
                    start_time: {
                        $gte: start,
                        $lte: yesterday
                    },
                    close_time: {
                        $gte: start,
                        $lte: yesterday
                    }
                }).sort('start_time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        return res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: result
                        });
                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred' + error
                        })
                    }
                });
                break;
            case 'BCH':
                BCH.find({
                    start_time: {
                        $gte: start,
                        $lte: yesterday
                    },
                    close_time: {
                        $gte: start,
                        $lte: yesterday
                    }
                }).sort('start_time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        return res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: result
                        });
                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred' + error
                        })
                    }
                });
                break;
            case 'BNB':
                BNB.find({
                    start_time: {
                        $gte: start,
                        $lte: yesterday
                    },
                    close_time: {
                        $gte: start,
                        $lte: yesterday
                    }
                }).sort('start_time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        return res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: result
                        });
                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred' + error
                        })
                    }
                });
                break;
            case 'BTC':
                BTC.find({
                    start_time: {
                        $gte: start,
                        $lte: yesterday
                    },
                    close_time: {
                        $gte: start,
                        $lte: yesterday
                    }
                }).sort('start_time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        return res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: result
                        });
                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred' + error
                        })
                    }
                });
                break;
            case 'DOT':
                DOT.find({
                    start_time: {
                        $gte: start,
                        $lte: yesterday
                    },
                    close_time: {
                        $gte: start,
                        $lte: yesterday
                    }
                }).sort('start_time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        return res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: result
                        });
                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred' + error
                        })
                    }
                });
                break;
            case 'ETH':
                ETH.find({
                    start_time: {
                        $gte: start,
                        $lte: yesterday
                    },
                    close_time: {
                        $gte: start,
                        $lte: yesterday
                    }
                }).sort('start_time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        return res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: result
                        });
                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred' + error
                        })
                    }
                });
                break;
            case 'LINK':
                LINK.find({
                    start_time: {
                        $gte: start,
                        $lte: yesterday
                    },
                    close_time: {
                        $gte: start,
                        $lte: yesterday
                    }
                }).sort('start_time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        return res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: result
                        });
                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred' + error
                        })
                    }
                });
                break;
            case 'LTC':
                LTC.find({
                    start_time: {
                        $gte: start,
                        $lte: yesterday
                    },
                    close_time: {
                        $gte: start,
                        $lte: yesterday
                    }
                }).sort('start_time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        return res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: result
                        });
                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred' + error
                        })
                    }
                });
                break;
            case 'XRP':
                XRP.find({
                    start_time: {
                        $gte: start,
                        $lte: yesterday
                    },
                    close_time: {
                        $gte: start,
                        $lte: yesterday
                    }
                }).sort('start_time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        return res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: result
                        });
                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred' + error
                        })
                    }
                });
                break;
            default:
                return res.status(500).json({
                    status: 'ERROR',
                    code: 3,
                    msg: 'The symbol is not correct'
                })
        }
        
    } else {
        return res.status(500).json({
            status: 'ERROR',
            code: 1,
            msg: 'Interval must be set'
        });
    }
});

router.post('/symbol/:symbol/historical/custom', async (req, res) => {
    var symbol = req.params.symbol;

    if (req.body.de != null && req.body.a != null) {
        var start = new Date(req.body.de);
        start = start.setHours(0, 0, 0, 0);
        var end = new Date(req.body.a);
        end = end.setHours(23, 59, 59, 999);
        // TODO:Hacer cosas con las fechas antes de nada!!!!!!!! (00:00:00.000 && 23:59.59.999)
        switch (symbol) {
            case 'ADA':
                ADA.find({
                    start_time: {
                        $gte: start,
                        $lte: end
                    },
                    close_time: {
                        $gte: start,
                        $lte: end
                    }
                }).sort('start_time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        return res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: result
                        });
                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred' + error
                        })
                    }
                });
                break;
            case 'BCH':
                BCH.find({
                    start_time: {
                        $gte: start,
                        $lte: end
                    },
                    close_time: {
                        $gte: start,
                        $lte: end
                    }
                }).sort('start_time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        return res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: result
                        });
                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred' + error
                        })
                    }
                });
                break;
            case 'BNB':
                BNB.find({
                    start_time: {
                        $gte: start,
                        $lte: end
                    },
                    close_time: {
                        $gte: start,
                        $lte: end
                    }
                }).sort('start_time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        return res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: result
                        });
                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred' + error
                        })
                    }
                });
                break;
            case 'BTC':
                BTC.find({
                    start_time: {
                        $gte: start,
                        $lte: end
                    },
                    close_time: {
                        $gte: start,
                        $lte: end
                    }
                }).sort('start_time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        return res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: result
                        });
                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred' + error
                        })
                    }
                });
                break;
            case 'DOT':
                DOT.find({
                    start_time: {
                        $gte: start,
                        $lte: end
                    },
                    close_time: {
                        $gte: start,
                        $lte: end
                    }
                }).sort('start_time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        return res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: result
                        });
                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred' + error
                        })
                    }
                });
                break;
            case 'ETH':
                ETH.find({
                    start_time: {
                        $gte: start,
                        $lte: end
                    },
                    close_time: {
                        $gte: start,
                        $lte: end
                    }
                }).sort('start_time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        return res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: result
                        });
                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred' + error
                        })
                    }
                });
                break;
            case 'LINK':
                LINK.find({
                    start_time: {
                        $gte: start,
                        $lte: end
                    },
                    close_time: {
                        $gte: start,
                        $lte: end
                    }
                }).sort('start_time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        return res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: result
                        });
                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred' + error
                        })
                    }
                });
                break;
            case 'LTC':
                LTC.find({
                    start_time: {
                        $gte: start,
                        $lte: end
                    },
                    close_time: {
                        $gte: start,
                        $lte: end
                    }
                }).sort('start_time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        return res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: result
                        });
                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred' + error
                        })
                    }
                });
                break;
            case 'XRP':
                XRP.find({
                    start_time: {
                        $gte: start,
                        $lte: end
                    },
                    close_time: {
                        $gte: start,
                        $lte: end
                    }
                }).sort('start_time').exec((error, result) => {
                    if (result != null && result.length > 0) {
                        return res.status(200).json({
                            status: 'OK',
                            code: 0,
                            msg: result
                        });
                    } else {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred' + error
                        })
                    }
                });
                break;
            default:
                return res.status(500).json({
                    status: 'ERROR',
                    code: 3,
                    msg: 'The symbol is not correct'
                })
        }
    } else {
        return res.status(500).json({
            status: 'ERROR',
            code: 1,
            msg: 'Interval must be set'
        });
    }
});

// Get user credits
router.get('/user/:id/credits', async (req, res) => {
    var id = req.params.id;

    User.findById(id, 'credits').exec((error, result) => {
        if (error) {
            return res.status(500).json({
                status: 'ERROR',
                code: 1,
                msg: 'Interval must be set'
            });
        } else {
            return res.status(200).json({
                status: 'OK',
                code: 0,
                msg: result.credits
            })
        }
    })
});

router.post('/user/:id/invest', async (req, res) => {
    var id = req.params.id;

    if (req.body.symbol != null && req.body.qty != null &&
         req.body.price != null && req.body.creditos != null &&
         req.body.date != null) {
        await Investment.create({
            user: id,
            symbol: req.body.symbol,
            date: new Date(req.body.date),
            qty: req.body.qty,
            price: req.body.price,
            spent: req.body.creditos,
            creationDate: new Date(),
            won: 0,
            closed: false
        }, async (err, result) => {
            if (err) return console.log(err);
            console.log('Inserted document with ID: ' + result.id); // TODO: Remove when deploying to prod.
            let creditos = 0;
            let u = {};
            let user = await User.findById(req.params.id, 'credits', (err, result) => {
                creditos = result.credits;
            });
            console.log(user);

            u.credits = creditos - parseInt(req.body.creditos);
            console.log(u);

            await user.updateOne(u, (err, result) => {
                if (err) {
                    res.status(500).json({
                        status: 'ERROR',
                        code: -1,
                        msg: 'An error has occured ' + err
                    });
                }
                
                return res.status(200).json({
                    status: 'OK',
                    code: 0,
                    msg: 'Inversion creada correctamente'
                });
            });

            
        });
    } else {
        return res.status(200).json({
            status: 'OK',
            code: 0,
            msg: 'Request must contain a symbol, quanity and price'
        });
    }
});


router.get('/user/:id/investments', async (req, res) => {
    var id = req.params.id;

    Investment.find({
        "user": id
    }).exec((error, result) => {
        if (error) {
            return res.status(500).json({
                status: 'ERROR',
                code: -1,
                msg: 'An error has ocurred ' + error
            });
        }
        return res.status(200).json({
            status: 'OK',
            code: 0,
            msg: result
        })
    })
});

router.put('/investment/:investment/close', async (req, res) => {
    var user_id = undefined;
    var invest = undefined;
    var i = {
        closed: true
    };

    if (req.body.actual != null) {
        var investment = await Investment.findById(new ObjectID(req.params.investment), 'user qty', async (err, result) => {
            invest = result;
            user_id = result.user;
        });

        i.won = req.body.actual * invest.qty;

        await investment.updateOne(i, async (err, r) => {
            if (err) {
                return res.status(500).json({
                    status: 'ERROR',
                    code: -1,
                    msg: 'An error has occured ' + err
                });
            }

            var u = {}
            var credits = 0;
            console.log(user_id);
            var user = await User.findById(new ObjectID(user_id), 'credits', async(err, resu) => {
                console.log('test');
                console.log(resu);
                credits = resu.credits;
                console.log(credits);
            });

            console.log('nibba');
            console.log(parseFloat(req.body.actual) * parseFloat(invest.qty));

            u.credits = (credits + (parseFloat(req.body.actual) * parseFloat(invest.qty)));
            console.log(u);

            user.updateOne(u, (err, resul) => {
                if (err) {
                    return res.status(500).json({
                        status: 'ERROR',
                        code: -1,
                        msg: 'An error has occured ' + err
                    });
                }

                return res.status(200).json({
                    status: 'OK',
                    code: 0,
                    msg: 'Investment ' + req.params.investment + ' closed'
                });
            });
        })

    } else {
        return res.status(500).json({
            status: 'ERROR',
            code: 1,
            msg: 'Actual price must be set'
        });
    }
});

router.get('/user/:id/addcredits', async (req, res) => {
    var id = req.params.id;

    console.log(id);

    var u = {
        credits: 2500
    }

    var user = await User.findById(id, 'credits', (err, result) => {
        if (err) {
            return res.status(500).json({
                status: 'ERROR',
                code: 1,
                msg: 'An error has ocurred ' + err
            });
        }

        u.credits += result.credits;
    });

    user.updateOne(u, (err, r) => {
        if (err) {
            return res.status(500).json({
                status: 'ERROR',
                code: 1,
                msg: 'An error has ocurred ' + err
            });
        }

        return res.status(200).json({
            status: 'OK',
            code: 0,
            msg: 'Creditos añadidos correctamente'
        });
    })
});

router.post('/user/:id/investmultiple', async (req, res) => {
    var id = req.params.id;
    var investments = [];
    var u = {
        credits: 0
    }
    
    if (req.body.inversiones != null) {
        req.body.inversiones.forEach(i => {
            investments.push({
                user: id,
                symbol: i.symbol,
                date: i.date,
                qty: i.qty,
                price: i.price,
                spent: i.spent,
                won: 0,
                creationDate: new Date(),
                closed: false
            });      
        });

        await Investment.insertMany(investments, async (error, docs) => {
            if (docs.length == req.body.inversiones.length) {
                var user = await User.findById(id, (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: -1,
                            msg: 'An error has ocurred'
                        });
                    }

                    u.credits = result.credits;
                });

                u.credits = u.credits - req.body.total;

                await user.updateOne(u, (err, r) => {
                    if (err) {
                        return res.status(500).json({
                            status: 'ERROR',
                            code: 1,
                            msg: 'An error has ocurred ' + err
                        });  
                    }
                })

                return res.status(200).json({
                    status: 'OK',
                    code: 0,
                    msg: 'Inversiones realizadas correctamente'
                });
            } else {
                return res.status(500).json({
                    status: 'ERROR',
                    code: -1,
                    msg: 'An error has ocurred'
                });
            }
        });

    } else {
        return res.status(500).json({
            status: 'ERROR',
            code: -1,
            msg: 'There are no investments'
        });
    }
});

module.exports = router;