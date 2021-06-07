const mongoose = require('mongoose');

const Schema = mongoose.Schema;



const investmentSchema = new Schema({
    user: String,
    symbol: String,
    date: Date, // date where the investment was supposed to be made (e.g: 01-01-2009)
    qty: Number, // Cantidad de monedas de la cripto
    price: Number, // Precio de la cripto al invertir
    spent: Number, // Cantidad de créditos gastados al invertir,
    won: Number, // Cantidad de créditos ganados al cerrar la inversión
    creationDate: Date,
    closed: Boolean
});

module.exports = mongoose.model('Investment', investmentSchema, 'INVESTMENT');