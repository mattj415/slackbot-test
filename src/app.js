import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// 404
app.use((req, res) => {
    res.status(404).send({
        status: 404,
        message: 'The requested resource was not found',
    });
});

module.exports = app;
