const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LTCSchema = mongoose.model('LTC', new Schema({
    symbol: String,
    start_time: Date,
    close_time: Date,
    open_price: String,
    close_price: String,
    highest: String,
    lowest: String,
    closed: Boolean
}), 'LTC');

module.exports = mongoose.model('LTC');