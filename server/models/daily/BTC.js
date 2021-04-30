import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const BTCDailySchema = mongoose.model('BTCDaily', new Schema({
    symbol: String,
    time: Date,
    price: String,
}), );

module.exports = mongoose.model('BTCDaily');