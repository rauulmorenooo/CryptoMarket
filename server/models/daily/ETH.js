const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ETHDailySchema = mongoose.model('ETHDaily', new Schema({
    symbol: String,
    time: Date,
    price: Number,
}), 'ETHDaily');

module.exports = mongoose.model('ETHDaily');