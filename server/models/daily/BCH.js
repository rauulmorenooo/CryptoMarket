const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BCHDailySchema = mongoose.model('BCHDaily', new Schema({
    symbol: String,
    time: Date,
    price: Number,
}), 'BCHDaily');

module.exports = mongoose.model('BCHDaily');