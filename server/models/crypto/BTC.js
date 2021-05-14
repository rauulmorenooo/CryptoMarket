const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BTCSchema = mongoose.model('BTC', new Schema({
    symbol: String,
    start_time: Date,
    close_time: Date,
    open_price: String,
    close_price: String,
    highest: String,
    lowest: String,
    closed: Boolean
}),'BTC');

module.exports = mongoose.model('BTC');