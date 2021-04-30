import mongoose from 'mongoose';
import Double from 'bson';

const Schema = mongoose.Schema;

const cryptoOptions = {
    discriminatorKey: 'cryptotype',
    collection: 'daily',
};

const cryptoSchema = mongoose.model('Daily', new Schema({
    symbol: String,
    time: Date,
    price: String,
}), );

module.exports = mongoose.model('Daily');