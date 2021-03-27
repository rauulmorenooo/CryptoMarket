const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    first_name: String,
    last_name: String,
    username: String,
    email: String,
    password: String,
    investments: Array
});

// Virtual for getting a user full name
userSchema.virtual('name').get(function() {
    return this.first_name + ' ' + this.last_name;
});

// Virtual for getting a user's URL
userSchema.virtual('url').get(function() {
    return '/user/' + this._id;
});

module.exports = mongoose.model('User', userSchema);
