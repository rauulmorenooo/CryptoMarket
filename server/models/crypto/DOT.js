const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DOTSchema = mongoose.model('DOT', new Schema({
    symbol: String,
    start_time: Date,
    close_time: Date,
    open_price: String,
    close_price: String,
    highest: String,
    lowest: String,
    closed: Boolean
}), 'DOT');

module.exports = mongoose.model('DOT');