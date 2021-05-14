const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BTCDailySchema = mongoose.model('BTCDaily', new Schema({
    symbol: String,
    time: Date,
    price: Number,
}), 'BTCDaily');

module.exports = mongoose.model('BTCDaily');