const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BCHSchema = mongoose.model('BCH', new Schema({
    symbol: String,
    start_time: Date,
    close_time: Date,
    open_price: String,
    close_price: String,
    highest: String,
    lowest: String,
    closed: Boolean
}), 'BCH');

module.exports = mongoose.model('BCH');