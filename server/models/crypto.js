const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cryptoOptions = {
    discriminatorKey: 'cryptotype',
    collection: 'crypto',
};

const cryptoSchema = mongoose.model('Crypto', new Schema({
    symbol: String,
    start_time: Date,
    close_time: Date,
    open_price: Number,
    close_price: Number,
    highest: Number,
    lowest: Number,
    closed: Boolean
}), );

module.exports = mongoose.model('Crypto');