const express = require('express');
const router = express.Router();
const Controller = require('../../controller');
const { botModel } = require('../../db/models');
const { logger, responser } = require('../../helpers');

router.post('/addBot', async (req, res) => {
    try {
        await botModel.save({
            name: req.body.name,
            VERIFY_TOKEN: req.body.VERIFY_TOKEN,
            ACCESS_TOKEN: req.body.ACCESS_TOKEN,
        });
        return responser(res, 200, { message: 'Created' });
    } catch (err) {
        return responser(res, 500, { message: 'Something went wrong: ' + err});
    }

    responser(res, 200, { message: 'Ok' });
});

router.get('/:botName', async (req, res) => {
    let bot;
    try {
        bot = await botModel.getOneByName({ name: req.params.botName });
        if (!bot) {
            return responser(res, 404, { message: 'Bot not found' });
        }

        if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === bot.VERIFY_TOKEN) {
            return responser(res, 200, req.query['hub.challenge']);
        } else {
            return responser(res, 400, { message: 'Incorrect verify token' });
        }
    } catch (err) {
        return responser(res, 500, { message: 'Something went wrong: ' + err});
    }
});

router.post('/:botName', async (req, res) => {
    let bot;
    try {
        bot = await botModel.getOneByName({ name: req.params.botName });
        if (!bot) {
            return responser(res, 404, { message: 'Bot not found' });
        }
    } catch (err) {
        return responser(res, 500, { message: 'Something went wrong: ' + err});
    }

    await Controller(req.body, bot);

    responser(res, 200, { message: 'Ok' });
});

module.exports = router;
