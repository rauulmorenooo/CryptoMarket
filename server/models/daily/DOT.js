const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DOTDailySchema = mongoose.model('DOTDaily', new Schema({
    symbol: String,
    time: Date,
    price: Number,
}), 'DOTDaily');

module.exports = mongoose.model('DOTDaily');