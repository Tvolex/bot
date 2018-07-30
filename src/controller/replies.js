const request = require('request');
const { logger } = require('../helpers');
const { FIXER_API_KEY = null, FIXER_URL = null } = process.env;

if (!FIXER_API_KEY || !FIXER_URL)
    logger.error(`Please, set up FIXER`);


const getCurrency = (from = "USD") => {
    let url = `${FIXER_URL}latest/?access_key=${FIXER_API_KEY}`;

    const to = "USD";
    if (from)
        url += `&base=${from}&symbols=${to}`;

    try {
        return new Promise((resolve, reject) => {
            request({
                url,
                'content-type': 'application/json',
            }, (error, response, body) => {
                if(error) {
                    logger.error(`Error: ${error}`);
                    reject(JSON.parse(error));
                }
                logger.info(`Fixer.io status: ${response.statusCode}`);

                return resolve(JSON.parse(body));
            });
        });
    } catch (err) {
        throw err;
    }

};

const replies = {
    getStarted: {
        payloadName: "sample_get_started_payload",
        reply: (convo) => {
            convo.ask({
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'button',
                        text: 'Please select currency',
                        buttons: [
                            {
                                type: 'postback',
                                title: 'UAH',
                                payload: 'UAH'
                            },
                            {
                                type: 'postback',
                                title: 'USD',
                                payload: 'USD'
                            },
                            {
                                type: 'postback',
                                title: 'EUR',
                                payload: 'EUR'
                            }
                        ]
                    }
                }
            });
            convo.next();
        }
    },

    Currency: {
        payloadName: "Currency",
        reply: async (convo) => {
            convo.ask({
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'button',
                        text: 'Please select currency',
                        buttons: [
                            {
                                type: 'postback',
                                title: 'AED',
                                payload: 'AED'
                            },
                            {
                                type: 'postback',
                                title: 'USD',
                                payload: 'USD'
                            },
                            {
                                type: 'postback',
                                title: 'EUR',
                                payload: 'EUR'
                            },
                            {
                                type: 'postback',
                                title: 'BTC',
                                payload: 'BTC'
                            }
                        ]
                    }
                }
            });
            convo.next();
        },
    },

    EUR: {
        payloadName: "EUR",
        reply: async(convo) => {
            try {
                const body = await getCurrency(this.payloadName);

                if (!body.success) {
                    logger.info(`Body: ${body}`);
                    convo.say(body.error.type);
                    return convo.next();
                }

                convo.say(`At date: ${body.date}. ${this.payloadName} = ${body.rates}` || 32);
                convo.next();
            } catch (err) {
                logger.error(`Error: ${err}`);
                convo.say(err);
                return convo.next();
            }

        }
    },

    AED: {
        payloadName: "AED",
        reply: async(convo) => {
            try {
                const body = await getCurrency(this.payloadName);

                if (!body.success) {
                    logger.info(`Body: ${body}`);
                    convo.say(body.error.type);
                    return convo.next();
                }

                convo.say(`At date: ${body.date}. ${this.payloadName} = ${body.rates}` || 32);
                convo.next();
            } catch (err) {
                logger.error(`Error: ${err}`);
                convo.say(err);
                return convo.next();
            }

        }
    },

    BTC: {
        payloadName: "BTC",
        reply: async(convo) => {
            try {
                const body = await getCurrency(this.payloadName);

                console.log(`Body: ${body}`);

                if (!body.success) {
                    logger.info(`Body: ${body}`);
                    convo.say(body.error.type);
                    return convo.next();
                }

                convo.say(`At date: ${body.date}. ${this.payloadName} = ${body.rates}` || 32);
                convo.next();
            } catch (err) {
                logger.error(`Error: ${err}`);
                convo.say(err);
                return convo.next();
            }

        }
    }
};

module.exports = replies;
