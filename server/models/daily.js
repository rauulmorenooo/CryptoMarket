const mongoose = require('mongoose');
import Double from 'bson';

const Schema = mongoose.Schema;

const cryptoOptions = {
    discriminatorKey: 'cryptotype',
    collection: 'daily',
};

const cryptoSchema = mongoose.model('Daily', new Schema({
    symbol: String,
    time: Date,
    price: Number,
}), );

module.exports = mongoose.model('Daily');