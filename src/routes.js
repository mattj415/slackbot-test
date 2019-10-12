import express from 'express'
import { log } from './util/serverUtils';
import config from 'config';

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

    const payload = req.body;
    if (payload.event === 'media.play'){
        const webhook = new IncomingWebhook(slackConfig.webhookURL);
        const msg = {
            text: `Server ${payload.Server.title} is playing the following ${payload.Metadata.type} ${payload.Metadata.title}`
        };

        await webhook.send(msg);
        res.send(`sent a message!:${msg}`);
    } else {
        res.send(`noop for ${payload.event}`);
        
    }
});

export default router;
  


