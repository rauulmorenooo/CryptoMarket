const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const history = require('connect-history-api-fallback');
const cors = require('cors');

const app = express();

app.set('PORT', process.env.PORT || 8081);
app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(express.static(path.join(__dirname, 'public')))
//app.use(express.static(path.join(__dirname, 'views')))
app.use(favicon(path.join(__dirname, '../dist', 'favicon.ico')));
app.use(express.static(path.join(__dirname, '../dist/')));
app.use(morgan('tiny'));




// This MUST go after the routes
app.use(history());

app.listen(app.get('PORT'), () => {
    console.log('Server is up and running on port ' + app.get('PORT'));
});