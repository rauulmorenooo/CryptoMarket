const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BNBSchema = mongoose.model('BNB', new Schema({
    symbol: String,
    start_time: Date,
    close_time: Date,
    open_price: String,
    close_price: String,
    highest: String,
    lowest: String,
    closed: Boolean
}), 'BNB');

module.exports = mongoose.model('BNB');