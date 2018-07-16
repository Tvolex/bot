const express = require('express');
const router = express.Router();

const { logger, responser } = require('../../helpers');

router.post('/', (req, res, next) => {
    const body = req.body;

    if (body.object === 'page') {

        body.entry.forEach(function(entry) {
            const webhook_event = entry.messaging[0];
            logger.info(webhook_event);
        });
        return responser(res, 200, { message: 'EVENT_RECEIVED' });
    } else
        return responser(res, 404, { message: 'Not found' });

});

router.get('/', (req, res, next) => {
    // Your verify token. Should be a random string.
    const VERIFY_TOKEN = "<YOUR_VERIFY_TOKEN>"

    // Parse the query params
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            logger.info('WEBHOOK_VERIFIED');
            return responser(res, 200, { message: challenge });

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            return responser(res, 403, { message: 'Forbidden' });
        }
    }

    return responser(res, 400, { message: 'Bad request' });
});
// 02155f4e9fcceca0cb990475261e7d66
module.exports = router;
