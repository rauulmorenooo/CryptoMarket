const mongoose = require('mongoose');
const Double = require('bson');

const { Schema } = mongoose;

const investmentSchema = new Schema({
    user: String,
    symbol: String,
    date: Date,
    qty: Double,
    price: Double
});

module.exports = mongoose.model('Investment', investmentSchema);