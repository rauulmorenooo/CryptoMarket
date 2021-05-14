const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LTCDailySchema = mongoose.model('LTCDaily', new Schema({
    symbol: String,
    time: Date,
    price: Number,
}), 'LTCDaily');

module.exports = mongoose.model('LTCDaily');