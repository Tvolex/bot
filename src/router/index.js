const express = require('express');
const router = express.Router();

const bot = require('./bot');
const home = require('./home');
const alive = require('./alive');
const webhook = require('./webhook');

router.get('/', home);
router.use('/bot', bot);
router.get('/alive', alive);
router.use('/webhook', webhook);

module.exports = router;
