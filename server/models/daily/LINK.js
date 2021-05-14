const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LINKDailySchema = mongoose.model('LINKDaily', new Schema({
    symbol: String,
    time: Date,
    price: Number,
}), 'LINKDaily');

module.exports = mongoose.model('LINKDaily');