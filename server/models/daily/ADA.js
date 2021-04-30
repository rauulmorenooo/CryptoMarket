import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ADADailySchema = mongoose.model('ADADaily', new Schema({
    symbol: String,
    time: Date,
    price: String,
}), );

module.exports = mongoose.model('ADADaily');