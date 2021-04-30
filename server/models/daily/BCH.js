import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const BCHDailySchema = mongoose.model('BCHDaily', new Schema({
    symbol: String,
    time: Date,
    price: String,
}), );

module.exports = mongoose.model('BCHDaily');