const { MONGODB_URI } = process.env;
const { logger } = require('../helpers');
const { MongoClient }= require('mongodb');
const { initModels } = require('./models');

const dbName = 'bot';

const dbService = {
    db: null,
    connect: callback => {
        MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, (err, client) => {
            if (err) {
                MongoClient.close();
                callback(err);
            }
            dbService.db = client.db(dbName);
            logger.info("Connected to database");
            callback(null);
        });
    }
};

module.exports = dbService;
