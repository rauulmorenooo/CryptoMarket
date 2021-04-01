import mongoose from 'mongoose';
import Double from 'bson';

const Schema = mongoose.Schema;



const investmentSchema = new Schema({
    user: String,
    symbol: String,
    date: Date,
    qty: Double,
    price: Double
});

module.exports = mongoose.model('Investment', investmentSchema);