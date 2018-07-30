const express = require('express');
const router = express.Router();

const { logger, responser } = require('../../helpers');
const Controller = require('../../controller');

router.post('/', (req, res, next) => {
    Controller(req.body);

    return responser(res, 200, { message: "Ok" });
});

router.get('/', (req, res, next) => {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {

        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            logger.info('WEBHOOK_VERIFIED');
            return responser(res, 200, challenge);

        } else {
            return responser(res, 403, { message: 'Forbidden' });
        }
    }

    return responser(res, 400, { message: 'Bad request' });
});

module.exports = router;
