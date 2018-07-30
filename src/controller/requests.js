const requests = {
    getStarted: {
        payloadName: "sample_get_started_payload",
        conversation: (bot, message, cb) => {
            bot.startConversation(message, cb);
        }
    },
    Currency: {
        payloadName: "Currency",
        conversation: async (bot, message, cb) => {
            bot.startConversation(message, cb);
        }
    },

    BTC: {
        payloadName: "BTC",
        conversation: async (bot, message, cb) => {
            bot.startConversation(message, cb);
        }
    },

    AED: {
        payloadName: "AED",
        conversation: async (bot, message, cb) => {
            bot.startConversation(message, cb);
        }
    },

    EUR: {
        payloadName: "EUR",
        conversation: async (bot, message, cb) => {
            bot.startConversation(message, cb);
        }
    },
};

module.exports = requests;
