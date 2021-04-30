import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const BNBDailySchema = mongoose.model('BNBDaily', new Schema({
    symbol: String,
    time: Date,
    price: String,
}), );

module.exports = mongoose.model('BNBDaily');