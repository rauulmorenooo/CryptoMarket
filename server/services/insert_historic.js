const cron = require('node-cron');

const mongoose = require('mongoose');
const mongoDB = 'mongodb://localhost:27017/cryptomarket';
mongoose.connect(mongoDB, {userNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Require all models
const BTCDaily = require('../models/daily/BTC');
const ETHDaily = require('../models/daily/ETH');
const BNBDaily = require('../models/daily/BNB');
const DOTDaily = require('../models/daily/DOT');
const ADADaily = require('../models/daily/ADA');
const XRPDaily = require('../models/daily/XRP');
const LTCDaily = require('../models/daily/LTC');
const LINKDaily = require('../models/daily/LINK');
const BCHDaily = require('../models/daily/BCH');

const BTC = require('../models/crypto/BTC');
const ETH = require('../models/crypto/ETH');
const BNB = require('../models/crypto/BNB');
const DOT = require('../models/crypto/DOT');
const ADA = require('../models/crypto/ADA');
const XRP = require('../models/crypto/XRP');
const LTC = require('../models/crypto/LTC');
const LINK = require('../models/crypto/LINK');
const BCH = require('../models/crypto/BCH');


const cronjob = async () => {
    
    // var today = new Date(new Date().setHours(0, 0, 0, 0));
    // var yesterday = new Date();
    // yesterday = new Date(new Date(yesterday.setDate(yesterday.getDate() - 1)).setHours(0, 0, 0, 0));

    var yesterday = new Date(new Date().setHours(0, 0, 0, 0));
    var today = new Date();
    today = new Date(new Date(today.setDate(yesterday.getDate() + 1)).setHours(0, 0, 0, 0));
    
    console.log('Starting cronjob at ' + today);
    console.log('Generating data for the interval ' + yesterday + ' to ' + today);
    
    // Bitcoin
    await BTCDaily.find({
        time: {
            $gte: yesterday,
            $lt: today
        }
    }).sort('time').exec(async (err, res) => {
        if (res != null &&  res.length > 0) {
            var high = res[0].price;
            var low = res[0].price;
            var stime = res[0].time;
            var oprice = res[0].price;
            var ctime = res[res.length - 1].time;
            var cprice = res[res.length - 1].price;
            var s = res[0].symbol

            res.forEach(r => {
                if (low > r) low = r;
                if (high < r) high = r;
            });

            await BTC.create({
                symbol: s,
                start_time: stime,
                close_time: ctime,
                open_price: oprice,
                close_price: cprice,
                highest: high,
                lowest: low,
                close: true
            }, async (error, result) => {
                if (error) console.log(error);
                console.log('Inserted document to BTC with ID: ' + result.id);

                await BTCDaily.deleteMany({}, (err, res) => {
                    if (err) console.log(err);
                    console.log(res);
                    console.log('Deleted documents from BTCDaily');
                });
            }); 
        } else {
            console.log('No data found for BTC');
        }
    });

    // Ethereum
    await ETHDaily.find({
        time: {
            $gte: yesterday,
            $lt: today
        }
    }).sort('time').exec(async (err, res) => {
        if (res != null &&  res.length > 0) {
            var high = res[0].price;
            var low = res[0].price;
            var stime = res[0].time;
            var oprice = res[0].price;
            var ctime = res[res.length - 1].time;
            var cprice = res[res.length - 1].price;
            var s = res[0].symbol

            res.forEach(r => {
                if (low > r) low = r;
                if (high < r) high = r;
            });

            await ETH.create({
                symbol: s,
                start_time: stime,
                close_time: ctime,
                open_price: oprice,
                close_price: cprice,
                highest: high,
                lowest: low,
                close: true
            }, async (error, result) => {
                if (error) console.log(error);
                console.log('Inserted document to ETH with ID: ' + result.id);

                await ETHDaily.deleteMany({}, (err, res) => {
                    if (err) console.log(err);
                    console.log(res);
                    console.log('Deleted documents from ETHDaily');
                });
            });
        } else {
            console.log('No data found for ETH');
        } 
    });

    // Binance coin
    await BNBDaily.find({
        time: {
            $gte: yesterday,
            $lt: today
        }
    }).sort('time').exec(async (err, res) => {
        if (res != null &&  res.length > 0) {
            var high = res[0].price;
            var low = res[0].price;
            var stime = res[0].time;
            var oprice = res[0].price;
            var ctime = res[res.length - 1].time;
            var cprice = res[res.length - 1].price;
            var s = res[0].symbol

            res.forEach(r => {
                if (low > r) low = r;
                if (high < r) high = r;
            });

            await BNB.create({
                symbol: s,
                start_time: stime,
                close_time: ctime,
                open_price: oprice,
                close_price: cprice,
                highest: high,
                lowest: low,
                close: true
            }, async (error, result) => {
                if (error) console.log(error);
                console.log('Inserted document to BNB with ID: ' + result.id);

                await BNBDaily.deleteMany({}, (err, res) => {
                    if (err) console.log(err);
                    console.log(res);
                    console.log('Deleted documents from BNBDaily');
                });
            }); 
        } else {
            console.log('No data found for BNB');
        }
    });

    // PolkaDOT
    await DOTDaily.find({
        time: {
            $gte: yesterday,
            $lt: today
        }
    }).sort('time').exec(async (err, res) => {
        if (res != null &&  res.length > 0) {
            var high = res[0].price;
            var low = res[0].price;
            var stime = res[0].time;
            var oprice = res[0].price;
            var ctime = res[res.length - 1].time;
            var cprice = res[res.length - 1].price;
            var s = res[0].symbol

            res.forEach(r => {
                if (low > r) low = r;
                if (high < r) high = r;
            });

            await DOT.create({
                symbol: s,
                start_time: stime,
                close_time: ctime,
                open_price: oprice,
                close_price: cprice,
                highest: high,
                lowest: low,
                close: true
            }, async (error, result) => {
                if (error) console.log(error);
                console.log('Inserted document to DOT with ID: ' + result.id);

                await DOTDaily.deleteMany({}, (err, res) => {
                    if (err) console.log(err);
                    console.log(res);
                    console.log('Deleted documents from DOTDaily');
                });
            }); 
        } else {
            console.log('No data found for DOT');
        }
    });

    // Cardano
    await ADADaily.find({
        time: {
            $gte: yesterday,
            $lt: today
        }
    }).sort('time').exec(async (err, res) => {
        if (res != null &&  res.length > 0) {
            var high = res[0].price;
            var low = res[0].price;
            var stime = res[0].time;
            var oprice = res[0].price;
            var ctime = res[res.length - 1].time;
            var cprice = res[res.length - 1].price;
            var s = res[0].symbol

            res.forEach(r => {
                if (low > r) low = r;
                if (high < r) high = r;
            });

            await ADA.create({
                symbol: s,
                start_time: stime,
                close_time: ctime,
                open_price: oprice,
                close_price: cprice,
                highest: high,
                lowest: low,
                close: true
            }, async (error, result) => {
                if (error) console.log(error);
                console.log('Inserted document to ADA with ID: ' + result.id);

                await ADADaily.deleteMany({}, (err, res) => {
                    if (err) console.log(err);
                    console.log(res);
                    console.log('Deleted documents from ADADaily');
                });
            }); 
        } else {
            console.log('No data found for ADA');
        }
    });

    // XRP
    await XRPDaily.find({
        time: {
            $gte: yesterday,
            $lt: today
        }
    }).sort('time').exec(async (err, res) => {
        if (res != null &&  res.length > 0) {
            var high = res[0].price;
            var low = res[0].price;
            var stime = res[0].time;
            var oprice = res[0].price;
            var ctime = res[res.length - 1].time;
            var cprice = res[res.length - 1].price;
            var s = res[0].symbol

            res.forEach(r => {
                if (low > r) low = r;
                if (high < r) high = r;
            });

            await XRP.create({
                symbol: s,
                start_time: stime,
                close_time: ctime,
                open_price: oprice,
                close_price: cprice,
                highest: high,
                lowest: low,
                close: true
            }, async (error, result) => {
                if (error) console.log(error);
                console.log('Inserted document to XRP with ID: ' + result.id);

                await XRPDaily.deleteMany({}, (err, res) => {
                    if (err) console.log(err);
                    console.log(res);
                    console.log('Deleted documents from XRPDaily');
                });
            }); 
        } else {
            console.log('No data found for XRP');
        }
    });

    // LiteCoin
    await LTCDaily.find({
        time: {
            $gte: yesterday,
            $lt: today
        }
    }).sort('time').exec(async (err, res) => {
        if (res != null &&  res.length > 0) {
            var high = res[0].price;
            var low = res[0].price;
            var stime = res[0].time;
            var oprice = res[0].price;
            var ctime = res[res.length - 1].time;
            var cprice = res[res.length - 1].price;
            var s = res[0].symbol

            res.forEach(r => {
                if (low > r) low = r;
                if (high < r) high = r;
            });

            await LTC.create({
                symbol: s,
                start_time: stime,
                close_time: ctime,
                open_price: oprice,
                close_price: cprice,
                highest: high,
                lowest: low,
                close: true
            }, async (error, result) => {
                if (error) console.log(error);
                console.log('Inserted document to LTC with ID: ' + result.id);

                await LTCDaily.deleteMany({}, (err, res) => {
                    if (err) console.log(err);
                    console.log(res);
                    console.log('Deleted documents from LTCDaily');
                });
            }); 
        } else {
            console.log('No data found for LTC');
        }
    });

    // ChainLINK
    await LINKDaily.find({
        time: {
            $gte: yesterday,
            $lt: today
        }
    }).sort('time').exec(async (err, res) => {
        if (res != null &&  res.length > 0) {
            var high = res[0].price;
            var low = res[0].price;
            var stime = res[0].time;
            var oprice = res[0].price;
            var ctime = res[res.length - 1].time;
            var cprice = res[res.length - 1].price;
            var s = res[0].symbol

            res.forEach(r => {
                if (low > r) low = r;
                if (high < r) high = r;
            });

            await LINK.create({
                symbol: s,
                start_time: stime,
                close_time: ctime,
                open_price: oprice,
                close_price: cprice,
                highest: high,
                lowest: low,
                close: true
            }, async (error, result) => {
                if (error) console.log(error);
                console.log('Inserted document to LINK with ID: ' + result.id);

                await LINKDaily.deleteMany({}, (err, res) => {
                    if (err) console.log(err);
                    console.log(res);
                    console.log('Deleted documents from LINKDaily');
                });
            }); 
        } else {
            console.log('No data found for LINK');
        }
    });

    // Bitcoin Cash
    await BCHDaily.find({
        time: {
            $gte: yesterday,
            $lt: today
        }
    }).sort('time').exec(async (err, res) => {
        if (res != null &&  res.length > 0) {
            var high = res[0].price;
            var low = res[0].price;
            var stime = res[0].time;
            var oprice = res[0].price;
            var ctime = res[res.length - 1].time;
            var cprice = res[res.length - 1].price;
            var s = res[0].symbol

            res.forEach(r => {
                if (low > r) low = r;
                if (high < r) high = r;
            });

            await BCH.create({
                symbol: s,
                start_time: stime,
                close_time: ctime,
                open_price: oprice,
                close_price: cprice,
                highest: high,
                lowest: low,
                close: true
                }, async (error, result) => {
                    if (error) console.log(error);
                    console.log('Inserted document to BCH with ID: ' + result.id);

                    await BCHDaily.deleteMany({}, (err, res) => {
                        if (err) console.log(err);
                    console.log(res);
                        console.log('Deleted documents from BCHDaily');
                    });
                }); 
            } else {
                console.log('No data found for BCH');
            }
        });
};

// cronjob();

cron.schedule('24 1 * * *', cronjob, {
    scheduled: true,
    timezone: 'Europe/Madrid'
});