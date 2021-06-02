// Package imports
import express from 'express';
import bcrypt from 'bcrypt-nodejs';
const mongoose = require('mongoose');
const moment = require('moment');

// User imports
import User from '../models/user';
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
            break;
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
                                        interval_start = new Date(re.time);
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
                                        interval_start = new Date(re.time);
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
                BNBDaily.find({}).sort('time').exec((error, result) => {
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
                BTCDaily.find({}).sort('time').exec((error, result) => {
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
                DOTDaily.find({}).sort('time').exec((error, result) => {
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
                ETHDaily.find({}).sort('time').exec((error, result) => {
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
                LINKDaily.find({}).sort('time').exec((error, result) => {
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
                LTCDaily.find({}).sort('time').exec((error, result) => {
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
                XRPDaily.find({}).sort('time').exec((error, result) => {
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
        return res.status(500).json({
            status: 'ERROR',
            code: 1,
            msg: 'Interval is not set'
        })
    }
});


module.exports = router;