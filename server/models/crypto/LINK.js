const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LINKSchema = mongoose.model('LINK', new Schema({
    symbol: String,
    start_time: Date,
    close_time: Date,
    open_price: String,
    close_price: String,
    highest: String,
    lowest: String,
    closed: Boolean
}), 'LINK');

module.exports = mongoose.model('LINK');