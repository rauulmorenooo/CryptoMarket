import mongoose from 'mongoose';
import Double from 'bson';

const Schema = mongoose.Schema;

const cryptoOptions = {
    discriminatorKey: 'cryptotype',
    collection: 'daily',
};

const cryptoSchema = mongoose.model('Daily', new Schema({
    symbol: String,
    start_time: Date,
    close_time: Date,
    open_price: Double,
    close_price: Double,
    highest: Double,
    lowest: Double,
    closed: Boolean
}), );

module.exports = mongoose.model('Daily');