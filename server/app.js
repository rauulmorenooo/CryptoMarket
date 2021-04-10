import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import history from 'connect-history-api-fallback';
import cors from 'cors';

// Routes
import cryptomarket from './routes/cryptomarket'

const app = express();

app.set('PORT', process.env.PORT || 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(express.static(path.join(__dirname, 'public')))
//app.use(express.static(path.join(__dirname, 'views')))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('tiny'));
app.use(cors());

app.use('/', cryptomarket);


// This MUST go after the routes
app.use(history());

app.listen(app.get('PORT'), () => {
    console.log('Server is up and running on port ' + app.get('PORT'));
});