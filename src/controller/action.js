const { logger } = require('../helpers');
const _ = require('lodash');
const requests = require('./requests');
const replies = require('./replies');
const action = (controller) => {
    controller.hears('(.*)', 'message_received', (bot, message) => {
        bot.startConversation(message, (err, convo) => {
            if (err)
                logger(`Error: ${err}`);

            convo.ask({
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'button',
                        text: 'Menu',
                        buttons: [
                            {
                                type: 'postback',
                                title: 'Currency',
                                payload: 'Currency',
                            }
                        ]
                    }
                }
            })
        })
    });

    controller.on('facebook_postback', async (bot, message) => {
        const { payload } = message;

        logger.info(`Payload - ${payload}`);

        const acceptablePayload = _.find(requests, (el) => el.payloadName === payload);
        const acceptableReply = _.find(replies, (el) => el.payloadName === payload);

        if (payload === acceptablePayload.payloadName) {

            acceptablePayload.conversation(bot, message, (err, convo) => {
                if (err)
                    logger.error(err);

                bot.reply(message, acceptableReply.reply(convo));
            });
        }
    });
};

module.exports = action;
