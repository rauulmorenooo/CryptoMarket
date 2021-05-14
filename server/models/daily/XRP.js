const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const XRPDailySchema = mongoose.model('XRPDaily', new Schema({
    symbol: String,
    time: Date,
    price: Number,
}), 'XRPDaily');

module.exports = mongoose.model('XRPDaily');