const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ADASchema = mongoose.model('ADA', new Schema({
    symbol: String,
    start_time: Date,
    close_time: Date,
    open_price: String,
    close_price: String,
    highest: String,
    lowest: String,
    closed: Boolean
}), 'ADA');

module.exports = mongoose.model('ADA');