import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import { log } from './util/serverUtils';
import usersRouter from './routes'

export default function (app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    // Routes
    app.use(usersRouter);

    // 404
    app.use((req, res) => {
        res.status(404).send({
            status: 404,
            message: 'The requested resource was not found',
        });
    });

    // 5xx
    app.use((err, req, res) => {
        log.error(err.stack);

        const message = process.env.NODE_ENV === 'production'
            ? 'Something went wrong, we\'re looking into it...'
            : err.stack;

        res.status(500).send({
            status: 500,
            message,
        });
    });
}
