import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ETHDailySchema = mongoose.model('ETHDaily', new Schema({
    symbol: String,
    time: Date,
    price: String,
}), );

module.exports = mongoose.model('ETHDaily');