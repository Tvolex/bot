const BotKit = require('botkit');
const { logger } = require('../helpers');
const { messageModel, userModel } = require('../db/models');
const action = require('./action');

async function createUserIfNew(id, ts) {
    let user;
    try {
        user = await userModel.getOneById(id);
        if (!user) {
            await userModel.save({ id, created_at: ts });
        }
    } catch (err) {
        logger.error(`Error: ${err}`);
    }
}

const handler = async (obj, botData = {}) => {
    const controller = BotKit.facebookbot({
        logger,
        debug: true,
        access_token: botData.ACCESS_TOKEN || process.env.ACCESS_TOKEN,
        verify_token: botData.VERIFY_TOKEN || process.env.VERIFY_TOKEN,
    });

    let conversation = null;
    try {
        conversation = action(controller);
    } catch (err) {
        logger.error("Message: " + err.message + " Stacktrace: " + err.stackTrace);
    }

    const bot = controller.spawn({}, () => {
        logger.info(`Bot has spawned.`);
    });
    controller.startTicking();
    controller.debug('Message received from FB');

    try {
        let message;
        if (obj.entry) {
            for (let e = 0; e < obj.entry.length; e++) {
                for (let m = 0; m < obj.entry[e].messaging.length; m++) {
                    const facebook_message = obj.entry[e].messaging[m];

                    console.log(facebook_message);

                    if (facebook_message.message) {
                        message = {
                            text: facebook_message.message.text,
                            user: facebook_message.sender.id,
                            channel: facebook_message.sender.id,
                            timestamp: facebook_message.timestamp,
                            seq: facebook_message.message.seq,
                            mid: facebook_message.message.mid,
                            attachments: facebook_message.message.attachments,
                        };
                        createUserIfNew(facebook_message.sender.id, facebook_message.timestamp);
                        await messageModel.save({
                            userId: facebook_message.sender.id,
                            botName: botData.name,
                            message: message.text,
                        });
                        controller.ingest(bot, facebook_message);
                    } else if (facebook_message.optin
                        || (facebook_message.postback && facebook_message.postback.payload === 'optin')) {
                        message = {
                            optin: facebook_message.optin,
                            user: facebook_message.sender.id,
                            channel: facebook_message.sender.id,
                            timestamp: facebook_message.timestamp,
                        };
                        createUserIfNew(facebook_message.sender.id, facebook_message.timestamp);
                        await messageModel.save({
                            userId: facebook_message.sender.id,
                            botName: botData.name,
                            message: message.text,
                        });
                        controller.trigger('facebook_optin', [bot, message]);
                    } else if (facebook_message.postback) {
                        message = {
                            payload: facebook_message.postback.payload,
                            user: facebook_message.sender.id,
                            channel: facebook_message.sender.id,
                            timestamp: facebook_message.timestamp,
                        };
                        createUserIfNew(facebook_message.sender.id, facebook_message.timestamp);
                        await messageModel.save({
                            userId: facebook_message.sender.id,
                            botName: botData.name,
                            message: message.text,
                        });
                        controller.trigger('facebook_postback', [bot, message]);
                    } else if (facebook_message.delivery) {
                        message = {
                            optin: facebook_message.delivery,
                            user: facebook_message.sender.id,
                            channel: facebook_message.sender.id,
                            timestamp: facebook_message.timestamp,
                        };

                        controller.trigger('message_delivered', [bot, message]);
                    } else {
                        controller.log('Got an unexpected message from Facebook: ', facebook_message);
                    }
                }
            }
        }
    } catch (e) {
        logger.error("Error: " + e);
    }


};

module.exports = handler;
