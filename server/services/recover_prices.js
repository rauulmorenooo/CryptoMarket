const axios = require('axios');
const timer = require('timers');

const mongoose = require('mongoose');
const mongoDB = 'mongodb://localhost:27017/cryptomarket';
mongoose.connect(mongoDB, {userNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Require all models that need to have data added
const BTC = require('../models/daily/BTC');
const ETH = require('../models/daily/ETH');
const BNB = require('../models/daily/BNB');
const DOT = require('../models/daily/DOT');
const ADA = require('../models/daily/ADA');
const XRP = require('../models/daily/XRP');
const LTC = require('../models/daily/LTC');
const LINK = require('../models/daily/LINK');
const BCH = require('../models/daily/BCH');


const recover_prices = () => {
    console.log('\x1b[36m%s\x1b[0m', '\n\n💸Recovering Crypto Prices💸\n');

    let date = new Date().toISOString();
    // Make request to Binance API to recover the actual price of all tickers
    axios.get('https://api.binance.com/api/v3/ticker/price')
        .then(async res => {
            // Get all symbols we are interested in
            let btcusdt = res.data.find(o => o.symbol == 'BTCUSDT');
            let ethusdt = res.data.find(o => o.symbol == 'ETHUSDT');
            let bnbusdt = res.data.find(o => o.symbol == 'BNBUSDT');
            let dotusdt = res.data.find(o => o.symbol == 'DOTUSDT');
            let adausdt = res.data.find(o => o.symbol == 'ADAUSDT');
            let xrpusdt = res.data.find(o => o.symbol == 'XRPUSDT');
            let ltcusdt = res.data.find(o => o.symbol == 'LTCUSDT');
            let linkusdt = res.data.find(o => o.symbol == 'LINKUSDT');
            let bchusdt = res.data.find(o => o.symbol == 'BCHUSDT');

            await BTC.create({
                symbol: btcusdt.symbol,
                time: date,
                price: btcusdt.price
            }, (err, result) => {
                if (err) return console.log(err);
                console.log('Inserted document with ID: ' + result.id);
            });

            await ETH.create({
                symbol: ethusdt.symbol,
                time: date,
                price: ethusdt.price
            }, (err, result) => {
                if (err) return console.log(err);
                console.log('Inserted document with ID: ' + result.id);
            });

            await BNB.create({
                symbol: bnbusdt.symbol,
                time: date,
                price: bnbusdt.price
            }, (err, result) => {
                if (err) return console.log(err);
                console.log('Inserted document with ID: ' + result.id);
            });

            await DOT.create({
                symbol: dotusdt.symbol,
                time: date,
                price: dotusdt.price
            }, (err, result) => {
                if (err) return console.log(err);
                console.log('Inserted document with ID: ' + result.id);
            });

            await ADA.create({
                symbol: adausdt.symbol,
                time: date,
                price: adausdt.price
            }, (err, result) => {
                if (err) return console.log(err);
                console.log('Inserted document with ID: ' + result.id);
            });

            await XRP.create({
                symbol: xrpusdt.symbol,
                time: date,
                price: xrpusdt.price
            }, (err, result) => {
                if (err) return console.log(err);
                console.log('Inserted document with ID: ' + result.id);
            });

            await LTC.create({
                symbol: ltcusdt.symbol,
                time: date,
                price: ltcusdt.price
            }, (err, result) => {
                if (err) return console.log(err);
                console.log('Inserted document with ID: ' + result.id);
            });

            await LINK.create({
                symbol: linkusdt.symbol,
                time: date,
                price: linkusdt.price
            }, (err, result) => {
                if (err) return console.log(err);
                console.log('Inserted document with ID: ' + result.id);
            });

            await BCH.create({
                symbol: bchusdt.symbol,
                time: date,
                price: bchusdt.price
            }, (err, result) => {
                if (err) return console.log(err);
                console.log('Inserted document with ID: ' + result.id);
            });
            
            })
            .catch(err => {
                console.log(err);
        });
};

// We need to call it one time before the setInterval to execute it at the start of the process
recover_prices();
timer.setInterval(recover_prices, 10000);