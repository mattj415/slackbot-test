import express from 'express'
import { log } from './util/serverUtils';
const router = new express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource!!!!!');
});

export default router;
  


