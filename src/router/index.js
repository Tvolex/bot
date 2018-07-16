const express = require('express');
const router = express.Router();

const home = require('./home');
const alive = require('./alive');
const webhook = require('./webhook');

router.get('/', home);
router.get('/alive', alive);
router.use('/webhook', webhook);

module.exports = router;
