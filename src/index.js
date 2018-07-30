const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const localtunnel = require('localtunnel');

const app = express();
const router = require('./router');
const { PORT = 3000, NODE_ENV } = process.env;
const dbService = require('./db/mongo');
const { logger, responser } = require('./helpers');
const { initModels } = require('./db/models');

app.use(bodyParser.json());

const InitDB = async () => {
    try {
        await initModels();
    } catch(err) {
        throw err;
    }

};

app.use(router);

app.use((err, req, res, next) => {
    if (_.isEqual(err.status, 404))
        return responser(res, 404, { message: "Not found" });
    else
        return responser(res, 500, { message: "Internal server error" });
});

process.on('error', (err) => {
    logger.error(err.message + ", Stacktrace: " + err.stackTrace);
});

dbService.connect(err => {
    if (err) {
        logger.info(err.toString());
        process.exit(1);
    }

    try {
        initModels();
        logger.info("Initialized models");
    } catch (e) {
        logger.error(`Error: ${e}`);
    }

    app.listen(PORT, () => {
        logger.info(`The server is started up on ${process.env.PORT}`);
    });

    if (_.isEqual(NODE_ENV, 'development')) {
        localtunnel(process.env.PORT, (err, tunnel) => {
            if (err)
                logger.error(`Error: ${err}`);
            logger.info('Tunnel: ' + tunnel.url);
        });
    }
});



