const BotKit = require('botkit');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {
    logger,
    responser
} = require('./helpers');
const router = require('./router');
const app = express();

app.use(bodyParser.json());

app.use(router);

app.use((err, req, res, next) => {
    if (_.isEqual(err.status, 404))
        responser(res, 404, { message: "Not found" });
    else
        responser(res, 500, { message: "Internal server error" });
});

app.listen(process.env.PORT || 3000, () => logger.info(`The server is started up on ${process.env.PORT}`));
