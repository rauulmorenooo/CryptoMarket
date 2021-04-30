import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const DOTDailySchema = mongoose.model('DOTDaily', new Schema({
    symbol: String,
    time: Date,
    price: String,
}), );

module.exports = mongoose.model('DOTDaily');