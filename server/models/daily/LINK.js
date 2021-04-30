import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const LINKDailySchema = mongoose.model('LINKDaily', new Schema({
    symbol: String,
    time: Date,
    price: String,
}), );

module.exports = mongoose.model('LINKDaily');