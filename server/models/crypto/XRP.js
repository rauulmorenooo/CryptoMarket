const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const XRPSchema = mongoose.model('XRP', new Schema({
    symbol: String,
    start_time: Date,
    close_time: Date,
    open_price: String,
    close_price: String,
    highest: String,
    lowest: String,
    closed: Boolean
}), 'XRP');

module.exports = mongoose.model('XRP');