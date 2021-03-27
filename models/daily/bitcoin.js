const mongoose = require('mongoose');
const daily = require('../daily');

const { Schema } = mongoose;

const bitcoin = daily.discriminator('BitcoinDaily', new Schema({}), );

module.exports = mongoose.model('BitcoinDaily');