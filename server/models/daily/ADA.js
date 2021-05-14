const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ADADailySchema = mongoose.model('ADADaily', new Schema({
    symbol: String,
    time: Date,
    price: Number,
}), 'ADADaily');

module.exports = mongoose.model('ADADaily');