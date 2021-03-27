const mongoose = require('mongoose');
const crypto = require('../crypto');


const { Schema } = mongoose;

const bitcoin = crypto.discriminator('Bitcoin', new Schema({}), );

module.exports = mongoose.model('Bitcoin');