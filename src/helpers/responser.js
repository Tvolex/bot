module.exports = responser = (res, status, msg) => {
    res
        .status(status)
        .send(msg);
};
