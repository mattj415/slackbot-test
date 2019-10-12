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

export default router;
  


