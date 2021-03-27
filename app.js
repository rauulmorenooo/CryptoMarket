const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Routers
const cryptomarket = require('./routes/cryptomarket');

const app = express();
const mongoDB = 'mongodb://localhost:27017/cryptomarket';

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', cryptomarket);

app.listen(3000, () => {
    console.log('Server is up and running on port 3000!');
});