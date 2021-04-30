import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const XRPDailySchema = mongoose.model('XRPDaily', new Schema({
    symbol: String,
    time: Date,
    price: String,
}), );

module.exports = mongoose.model('XRPDaily');