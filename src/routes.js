import express from 'express'
import { log } from './util/serverUtils';
import config from 'config';
import Busboy from 'busboy'
const inspect = require('util').inspect;

const slackConfig = config.get('slack');
const { IncomingWebhook } = require('@slack/webhook');

const router = new express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource!!!!!');
});

router.post('/slack/postMessage', async function(req, res, next) {
    const webhook = new IncomingWebhook(slackConfig.webhookURL);
    log.info(req);
    await webhook.send(req.body);
    res.send('sent a message!');
});
router.post('/plex', async function(req, res, next) {
    const busboy = new Busboy({ headers: req.headers });
    let payload = null;
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        log.info('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        file.on('data', function(data) {
            log.info('File [' + fieldname + '] got ' + data.length + ' bytes');
        });
        file.on('end', function() {
            log.info('File [' + fieldname + '] Finished');
        });
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        if (fieldname === 'payload') {
            try {
                payload = JSON.parse(val);
            } catch (e) {
                log.info(e);
            }
        log.info('create payload');

        } else {
          log.info('Field [' + fieldname + ']: value: ' + inspect(val));
        }
    });
    busboy.on('finish', async function() {
        log.info('Done parsing form!');
        log.info('check payload');
        if (payload ) {
            log.info('found payload');
            
            if (payload.event === 'media.play'){
                const webhook = new IncomingWebhook(slackConfig.webhookURL);
                const msg = {
                    text: `Server ${payload.Server.title} is playing the following ${payload.Metadata.type} ${payload.Metadata.title}`
                };

                await webhook.send(msg);
                log.info(`sent a message!:${msg}`);
            } else {
                log.info(`noop for ${payload.event}`);
            }
        }
        res.writeHead(303, { Connection: 'close', Location: '/' });
        res.end();
    });
    return req.pipe(busboy);
});

export default router;
  


