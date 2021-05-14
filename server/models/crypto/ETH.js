const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ETHSchema = mongoose.model('ETH', new Schema({
    symbol: String,
    start_time: Date,
    close_time: Date,
    open_price: String,
    close_price: String,
    highest: String,
    lowest: String,
    closed: Boolean
}), 'ETH');

module.exports = mongoose.model('ETH');