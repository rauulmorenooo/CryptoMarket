const fs = require('fs');
const path = require('path');
const readline = require('readline');

const mongoose = require('mongoose');
const mongoDB = 'mongodb://localhost:27017/cryptomarket';
mongoose.connect(mongoDB, {userNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Require all models
const BTC = require('../models/crypto/BTC');
const ETH = require('../models/crypto/ETH');
const BNB = require('../models/crypto/BNB');
const DOT = require('../models/crypto/DOT');
const ADA = require('../models/crypto/ADA');
const XRP = require('../models/crypto/XRP');
const LTC = require('../models/crypto/LTC');
const LINK = require('../models/crypto/LINK');
const BCH = require('../models/crypto/BCH');


var btc = [];
var eth = [];
var bnb = [];
var dot = [];
var ada = [];
var xrp = [];
var ltc = [];
var link = [];
var bch = [];


const readInterfaceBTC = readline.createInterface({
    input: fs.createReadStream(path.join(__dirname, '/historical_data/btc.csv')),
    output: process.stdout,
    console: false
});

readInterfaceBTC.on('line', async (line) => {
    var data = line.split(";");

    var s = 'BTCUSDT'

    var stime = new Date(data[0]);
    var ctime = new Date(data[0]);
    ctime.setHours(23, 59, 58);
    // console.log(stime.toString());
    // console.log(ctime.toString());

    var cprice = data[1].replaceAll('"', '');
    cprice = data[1].replaceAll(',', '');

    var oprice = data[2].replaceAll('"', '');
    oprice = data[2].replaceAll(',', '');

    var high = data[3].replaceAll('"', '');
    high = data[3].replaceAll(',', '');

    var low = data[4].replaceAll('"', '');
    low = data[4].replaceAll(',', '');

    btc.push({
        symbol: s,
        start_time: stime,
        close_time: ctime,
        open_price: oprice,
        close_price: cprice,
        highest: high,
        lowest: low,
        close: true
    });
});

BTC.insertMany(btc, (err, res) => {
    if (err) console.log(err);
    console.log('Inserted document with ID: ' + res.id);
});


const readInterfaceETH = readline.createInterface({
    input: fs.createReadStream(path.join(__dirname, '/historical_data/eth.csv')),
    output: process.stdout,
    console: false
});

readInterfaceETH.on('line', async (line) => {
    var data = line.split(";");

    var s = 'ETHUSDT'

    var stime = new Date(data[0]);
    var ctime = new Date(data[0]);
    ctime.setHours(23, 59, 58);

    var cprice = data[1].replaceAll('"', '');
    cprice = data[1].replaceAll(',', '');

    var oprice = data[2].replaceAll('"', '');
    oprice = data[2].replaceAll(',', '');

    var high = data[3].replaceAll('"', '');
    high = data[3].replaceAll(',', '');

    var low = data[4].replaceAll('"', '');
    low = data[4].replaceAll(',', '');

    eth.push({
        symbol: s,
        start_time: stime,
        close_time: ctime,
        open_price: oprice,
        close_price: cprice,
        highest: high,
        lowest: low,
        close: true
    });
});

ETH.insertMany(eth, (err, res) => {
    if (err) console.log(err);
    console.log('Inserted document with ID: ' + res.id);
});


const readInterfaceBNB = readline.createInterface({
    input: fs.createReadStream(path.join(__dirname, '/historical_data/bnb.csv')),
    output: process.stdout,
    console: false
});

readInterfaceBNB.on('line', async (line) => {
    var data = line.split(";");

    var s = 'BNBUSDT'

    var stime = new Date(data[0]);
    var ctime = new Date(data[0]);
    ctime.setHours(23, 59, 58);

    var cprice = data[1].replaceAll('"', '');
    cprice = data[1].replaceAll(',', '');

    var oprice = data[2].replaceAll('"', '');
    oprice = data[2].replaceAll(',', '');

    var high = data[3].replaceAll('"', '');
    high = data[3].replaceAll(',', '');

    var low = data[4].replaceAll('"', '');
    low = data[4].replaceAll(',', '');

    bnb.push({
        symbol: s,
        start_time: stime,
        close_time: ctime,
        open_price: oprice,
        close_price: cprice,
        highest: high,
        lowest: low,
        close: true
    });
});

BNB.insertMany(bnb, (err, res) => {
    if (err) console.log(err);
    console.log('Inserted document with ID: ' + res.id);
});


const readInterfaceDOT = readline.createInterface({
    input: fs.createReadStream(path.join(__dirname, '/historical_data/dot.csv')),
    output: process.stdout,
    console: false
});

readInterfaceDOT.on('line', async (line) => {
    var data = line.split(";");

    var s = 'DOTUSDT'

    var stime = new Date(data[0]);
    var ctime = new Date(data[0]);
    ctime.setHours(23, 59, 58);

    var cprice = data[1].replaceAll('"', '');
    cprice = data[1].replaceAll(',', '');

    var oprice = data[2].replaceAll('"', '');
    oprice = data[2].replaceAll(',', '');

    var high = data[3].replaceAll('"', '');
    high = data[3].replaceAll(',', '');

    var low = data[4].replaceAll('"', '');
    low = data[4].replaceAll(',', '');

    dot.push({
        symbol: s,
        start_time: stime,
        close_time: ctime,
        open_price: oprice,
        close_price: cprice,
        highest: high,
        lowest: low,
        close: true
    });
});

DOT.insertMany(dot, (err, res) => {
    if (err) console.log(err);
    console.log('Inserted document with ID: ' + res.id);
});


const readInterfaceADA = readline.createInterface({
    input: fs.createReadStream(path.join(__dirname, '/historical_data/ada.csv')),
    output: process.stdout,
    console: false
});

readInterfaceADA.on('line', async (line) => {
    var data = line.split(";");

    var s = 'ADAUSDT'

    var stime = new Date(data[0]);
    var ctime = new Date(data[0]);
    ctime.setHours(23, 59, 58);

    var cprice = data[1].replaceAll('"', '');
    cprice = data[1].replaceAll(',', '');

    var oprice = data[2].replaceAll('"', '');
    oprice = data[2].replaceAll(',', '');

    var high = data[3].replaceAll('"', '');
    high = data[3].replaceAll(',', '');

    var low = data[4].replaceAll('"', '');
    low = data[4].replaceAll(',', '');

    ada.push({
        symbol: s,
        start_time: stime,
        close_time: ctime,
        open_price: oprice,
        close_price: cprice,
        highest: high,
        lowest: low,
        close: true
    });
});

ADA.insertMany(ada, (err, res) => {
    if (err) console.log(err);
    console.log('Inserted document with ID: ' + res.id);
});


const readInterfaceXRP = readline.createInterface({
    input: fs.createReadStream(path.join(__dirname, '/historical_data/xrp.csv')),
    output: process.stdout,
    console: false
});

readInterfaceXRP.on('line', async (line) => {
    var data = line.split(";");

    var s = 'XRPUSDT'

    var stime = new Date(data[0]);
    var ctime = new Date(data[0]);
    ctime.setHours(23, 59, 58);

    var cprice = data[1].replaceAll('"', '');
    cprice = data[1].replaceAll(',', '');

    var oprice = data[2].replaceAll('"', '');
    oprice = data[2].replaceAll(',', '');

    var high = data[3].replaceAll('"', '');
    high = data[3].replaceAll(',', '');

    var low = data[4].replaceAll('"', '');
    low = data[4].replaceAll(',', '');

    xrp.push({
        symbol: s,
        start_time: stime,
        close_time: ctime,
        open_price: oprice,
        close_price: cprice,
        highest: high,
        lowest: low,
        close: true
    });
});

XRP.insertMany(xrp, (err, res) => {
    if (err) console.log(err);
    console.log('Inserted document with ID: ' + res.id);
});


const readInterfaceLTC = readline.createInterface({
    input: fs.createReadStream(path.join(__dirname, '/historical_data/ltc.csv')),
    output: process.stdout,
    console: false
});

readInterfaceLTC.on('line', async (line) => {
    var data = line.split(";");

    var s = 'LTCUSDT'

    var stime = new Date(data[0]);
    var ctime = new Date(data[0]);
    ctime.setHours(23, 59, 58);

    var cprice = data[1].replaceAll('"', '');
    cprice = data[1].replaceAll(',', '');

    var oprice = data[2].replaceAll('"', '');
    oprice = data[2].replaceAll(',', '');

    var high = data[3].replaceAll('"', '');
    high = data[3].replaceAll(',', '');

    var low = data[4].replaceAll('"', '');
    low = data[4].replaceAll(',', '');

    ltc.push({
        symbol: s,
        start_time: stime,
        close_time: ctime,
        open_price: oprice,
        close_price: cprice,
        highest: high,
        lowest: low,
        close: true
    });
});

LTC.insertMany(ltc, (err, res) => {
    if (err) console.log(err);
    console.log('Inserted document with ID: ' + res.id);
});

const readInterfaceLINK = readline.createInterface({
    input: fs.createReadStream(path.join(__dirname, '/historical_data/link.csv')),
    output: process.stdout,
    console: false
});

readInterfaceLINK.on('line', async (line) => {
    var data = line.split(";");

    var s = 'LINKUSDT'

    var stime = new Date(data[0]);
    var ctime = new Date(data[0]);
    ctime.setHours(23, 59, 58);

    var cprice = data[1].replaceAll('"', '');
    cprice = data[1].replaceAll(',', '');

    var oprice = data[2].replaceAll('"', '');
    oprice = data[2].replaceAll(',', '');

    var high = data[3].replaceAll('"', '');
    high = data[3].replaceAll(',', '');

    var low = data[4].replaceAll('"', '');
    low = data[4].replaceAll(',', '');

    link.push({
        symbol: s,
        start_time: stime,
        close_time: ctime,
        open_price: oprice,
        close_price: cprice,
        highest: high,
        lowest: low,
        close: true
    });
});

LINK.insertMany(link, (err, res) => {
    if (err) console.log(err);
    console.log('Inserted document with ID: ' + res.id);
});


const readInterfaceBCH = readline.createInterface({
    input: fs.createReadStream(path.join(__dirname, '/historical_data/bch.csv')),
    output: process.stdout,
    console: false
});

readInterfaceBCH.on('line', async (line) => {
    var data = line.split(";");

    var s = 'BCHUSDT'

    var stime = new Date(data[0]);
    var ctime = new Date(data[0]);
    ctime.setHours(23, 59, 58);

    var cprice = data[1].replaceAll('"', '');
    cprice = data[1].replaceAll(',', '');

    var oprice = data[2].replaceAll('"', '');
    oprice = data[2].replaceAll(',', '');

    var high = data[3].replaceAll('"', '');
    high = data[3].replaceAll(',', '');

    var low = data[4].replaceAll('"', '');
    low = data[4].replaceAll(',', '');

    bch.push({
        symbol: s,
        start_time: stime,
        close_time: ctime,
        open_price: oprice,
        close_price: cprice,
        highest: high,
        lowest: low,
        close: true
    });
});

BCH.insertMany(bch, (err, res) => {
    if (err) console.log(err);
    console.log('Inserted document with ID: ' + res.id);
});

mongoose.connection.close();