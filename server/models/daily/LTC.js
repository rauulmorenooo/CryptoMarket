import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const LTCDailySchema = mongoose.model('LTCDaily', new Schema({
    symbol: String,
    time: Date,
    price: String,
}), );

module.exports = mongoose.model('LTCDaily');