const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BNBDailySchema = mongoose.model('BNBDaily', new Schema({
    symbol: String,
    time: Date,
    price: Number,
}), 'BNBDaily');

module.exports = mongoose.model('BNBDaily');