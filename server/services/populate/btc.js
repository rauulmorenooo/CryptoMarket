const fs = require('fs');
const path = require('path');
const readline = require('readline');

const mongoose = require('mongoose');
const mongoDB = 'mongodb://localhost:27017/cryptomarket';
mongoose.connect(mongoDB, {userNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Require models
const BTC = require('../../models/crypto/BTC');

async function populate_btc() {
    const readInterfaceBTC = readline.createInterface({
        input: fs.createReadStream(path.join(__dirname, '../historical_data/btc.csv'))
    });
    
    await readInterfaceBTC.on('line', async (line) => {
        var data = line.split(";");

        var s = 'BTCUSDT'

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

        await BTC.create({
            symbol: s,
            start_time: stime,
            close_time: ctime,
            open_price: oprice,
            close_price: cprice,
            highest: high,
            lowest: low,
            close: true
        }, (err, res) => {
            if (err) console.log(err);
            console.log('Inserted document with ID: ' + res.id);
        });
    });
}

populate_btc();